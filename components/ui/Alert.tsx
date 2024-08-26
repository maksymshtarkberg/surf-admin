import React, { FC, useEffect, useState } from "react";
import { classNames } from "utils/helpers";

type AlertType = "danger" | "success" | "default" | "error";

type Props = {
  alertType?: AlertType;
  message: string;
  delay?: number;
};

const Alert: FC<Props> = ({ message, alertType = "default", delay = 3 }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), delay * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case "danger":
        return "text-red-400 border-red-700/70 bg-red-500/20";
      case "success":
        return "text-emerald-400 border-emerald-700/70 bg-emerald-400/20";
      default:
        return "text-sky-400 border-sky-700/70 bg-sky-500/20";
    }
  };

  return (
    <>
      {showAlert && (
        <div
          className={classNames(
            getAlertStyles(alertType),
            "border-2 text-center rounded-md p-4 mb-4 text-sm mt-2"
          )}
          role="alert"
        >
          {message}
        </div>
      )}
    </>
  );
};

export default Alert;
