const COURSE_API = "https://api.codingthailand.com/api/course";

export type CourseDTO = {
  title: string;
  detail: string;
  picture: string;
};

export async function getCourses(): Promise<CourseDTO[]> {
  const response = await fetch(COURSE_API);
  const courseResponse = await response.json();
  return courseResponse.data ?? [];
}
