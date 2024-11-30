import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Links, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const taskId = params.taskId;
  if (!taskId) {
    throw new Response("Not Found", { status: 404 });
  }

  const task = await prisma.task.findUnique({
    where: { id: parseInt(taskId) },
  });

  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }

  return Response.json({ task });
}
export default function TaskDetails() {
  const { task } = useLoaderData<typeof loader>();

  return (
    <div className="p-4 max-w-xl mx-auto h-full bg-gray-900 shadow-lg rounded-lg">
      <div className="grid grid-cols-3">
        <Link to={"/tasks"} className="text-gray-600 hover:text-gray-800">
        <button className="btn">Back</button>
        </Link>
        <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
        <button
          value="edit task"
          className="rounded-full border p-1 transition disabled:pointer-events-none disabled:opacity-25 border-gray-700 hover:bg-gray-700"
        >Edit</button>
      </div>
      
      <p className="text-gray-600 mb-4">{task.description}</p>
      <div className="flex flex-col justify-between text-sm text-gray-500">
        <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
        <p>
          {task.completed && task.completedAt && (
            <span>Completed: {new Date(task.completedAt).toLocaleString()}</span>
          )}
        </p>
      </div>
    </div>
  );
}
