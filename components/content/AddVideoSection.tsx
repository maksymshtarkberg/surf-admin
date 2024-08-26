"use client";
import DropDown from "@ui/Dropdown";
import Headline from "@ui/Headline";

import { useState } from "react";
import Button from "@ui/Button";
import ProgressBar from "@ui/ProgressBar";
import Alert from "@ui/Alert";
import TextInput from "@ui/TextInput";
import { VIDEO_PLATFORMS } from "constants/panel";

const AddVideoSection = () => {
  const [settings, setSettings] = useState({
    parseRelated: false,
    parseImage: false,
    target: 0,
    completed: 0,
    progress: 0,
    successfullTags: 0,
    isRunning: false,
    isDone: false,
    tags: [] as string[],
  });

  const [videoPlatform, setVideoPlatform] = useState("recorded");
  const [title, setTitle] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const updateSettings = (newSettings: any) => {
    setSettings((currentSettings) => {
      return { ...currentSettings, ...newSettings };
    });
  };

  const { completed, target, isRunning, isDone } = settings;

  const addVideo = async () => {
    setIsSubmitting(true);
    setAlertMessage("");
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalImage: "http://example.com/image.jpg",
          plattform: videoPlatform,
          originalId: "abcd1234",
          title: title.trim(),
          videoSrc: videoSrc.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Video added successfully:", data);

      updateSettings({
        isRunning: false,
        isDone: true,
        completed: target,
        successfullTags: target,
      });
      setAlertMessage("Video added successfully!");
      setTitle("");
      setVideoSrc("");
    } catch (error: any) {
      setAlertMessage(`Failed to add video: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVideoClick = () => {
    if (title && videoSrc) {
      setSettings({ ...settings, isRunning: true });
      addVideo();
    } else {
      setAlertMessage("Please fill in all required fields.");
    }
  };

  return (
    <>
      <Headline text="Add video" />
      <DropDown
        items={VIDEO_PLATFORMS}
        selectedQuery={videoPlatform}
        updateFilterQuery={(newRole) => {
          setVideoPlatform(newRole as string);
          if (newRole === "tag") updateSettings({ parseImage: false });
        }}
      />

      <TextInput
        label="Title"
        handleChange={(e) => setTitle(e.target.value)}
        value={title}
        placeholder="Title"
      />
      <TextInput
        label="Video URL"
        handleChange={(e) => setVideoSrc(e.target.value)}
        value={videoSrc}
        placeholder="Video URL"
      />
      {!isRunning && (
        <Button
          title="Add Video"
          handleClick={handleAddVideoClick}
          disabled={isSubmitting}
        />
      )}
      {isRunning && (
        <ProgressBar
          completed={settings.completed}
          target={settings.target}
          progress={settings.progress}
          color="bg-emerald-500"
        />
      )}
      {alertMessage && (
        <Alert
          message={alertMessage}
          alertType={isDone ? "success" : "error"}
        />
      )}
    </>
  );
};

export default AddVideoSection;
