import { useParams } from "react-router-dom";
import { ProfileLayout } from "../components/profile-layout";

export function About() {
  const userId = useParams();
  return <ProfileLayout></ProfileLayout>;
}
