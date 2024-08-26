import { connectToDbHandler } from "@db/database";
import { getTag, removeTagById, updateTag } from "@db/services/tags.service";
import { IMAGE_SETTINGS } from "constants/image";
import { NextApiRequest, NextApiResponse } from "next";
import { Tag } from "types/types";
import { hasSession } from "utils/auth";
import { createImage, deleteImage } from "utils/cdn";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!(await hasSession(req))) {
      return res.status(400).json({ message: "API Error - No Auth" });
    }
    const id = req.query.id as string;

    if (req.method === "GET") {
      const tag = await getTag(id);
      return res.status(200).json(tag);
    }
    if (req.method === "PATCH") {
      const tag = await getTag(id);
      let updatedTag = null;
      if (
        (req.body.originalImage &&
          tag.originalImage !== req.body.originalImage) ||
        (req.body.originalImage === "" &&
          tag.originalImage !== req.body.originalImage) ||
        (req.body.name && tag.name !== req.body.name) ||
        (req.body.role && tag.role !== req.body.role)
      ) {
        const oldRole = tag.role as "tag";
        if (tag.originalImage) {
          console.log("Deleting old image with path:", tag.originalImage);
          deleteImage(
            tag.originalImage,
            tag.name,
            IMAGE_SETTINGS[oldRole].subPath,
            IMAGE_SETTINGS[oldRole].prefix
          );
        }
        const role = req.body.role as "tag";
        const newImage = req.body.originalImage;
        console.log("Creating new image with path:", newImage);
        const image = newImage
          ? await createImage(
              newImage,
              req.body.name,
              IMAGE_SETTINGS[role].height,
              IMAGE_SETTINGS[role].width,
              IMAGE_SETTINGS[role].subPath,
              IMAGE_SETTINGS[role].prefix
            )
          : "";
        updatedTag = await updateTag(id, { ...req.body, image: image || "" });
      } else {
        updatedTag = await updateTag(id, req.body);
      }
      return res.status(200).send({ updatedTag, message: "Tag updated" });
    }
    if (req.method === "DELETE") {
      const tag = (await getTag(id)) as Tag;
      if (tag.originalImage) {
        const role = tag.role as "tag";
        console.log("Deleting image with path:", tag.originalImage);
        deleteImage(
          tag.originalImage,
          tag.name,
          IMAGE_SETTINGS[role].subPath,
          IMAGE_SETTINGS[role].prefix
        );
      }
      await removeTagById(id);
      return res.status(200).send({ message: "Tag deleted" });
    }
  } catch (err: any) {
    console.error("API Error:", err);
    return res.status(400).json({
      message: `API Error ${err.message || "Unknown error"}`,
    });
  }
  return res.status(400).json({ message: "API Error" });
};

export default connectToDbHandler(handler);
