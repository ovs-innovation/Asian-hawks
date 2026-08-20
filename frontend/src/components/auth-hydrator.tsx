"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrate } from "@/store/authSlice";

export function AuthHydrator() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);
  return null;
}
