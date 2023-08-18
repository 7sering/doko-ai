"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("87128e17-0493-45d1-a2cd-f253821d10b0");
  }, []);

  return null;
};
