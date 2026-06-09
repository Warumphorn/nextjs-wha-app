import FeaturesCourse from "@/components/features-course";
import { getCourses } from "@/services";

// http://localhost:3000/course
export default async function CoursePage() {
  const courses = await getCourses();

  return (
    <main>
      {
        courses.length > 0 && <FeaturesCourse courses={courses} />
      }
    </main>
  );
}