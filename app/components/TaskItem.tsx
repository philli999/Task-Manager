import { Link, redirect, useFetcher, useFetchers, useParams } from "@remix-run/react";
import { useState } from "react";

import DeleteIcon from "~/components/icons/DeleteIcon";
import EditIcon from "~/components/icons/EditIcon";
import SaveIcon from "~/components/icons/SaveIcon";
import SquareCheckIcon from "~/components/icons/SquareCheckIcon";
import SquareIcon from "~/components/icons/SquareIcon";
import { Task } from "@prisma/client";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
  timeZone: "CET",
});

export default function TaskItem({ todo }: { todo: Task }) {
  const fetchers = useFetchers();
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const { taskId } = useParams();

  const editing = typeof document !== "undefined" ? isEditing : todo.editing;

  const isClearingCompleted = fetchers.some(
    (fetcher) =>
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intent") === "clear completed"
  );

  const isDeletingAll = fetchers.some(
    (fetcher) =>
      fetcher.state === "submitting" &&
      fetcher.formData?.get("intent") === "delete all"
  );

  const actionInProgress =
    isDeletingAll || (todo.completed && isClearingCompleted);

  const isTogglingCompletion =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "toggle completion";

  const isSaving =
    fetcher.state !== "idle" && fetcher.formData?.get("intent") === "save task";

  const completed = isTogglingCompletion
    ? !JSON.parse(fetcher.formData?.get("completed") as string)
    : todo.completed;

  const completedAt =
    isTogglingCompletion || !todo.completedAt ? new Date() : todo.completedAt;

  const title = isSaving
    ? (fetcher.formData?.get("title") as string)
    : todo.title;


  return (
    <li
      className={`my-2 flex items-center gap-4 border-b border-dashed pb-4 last:border-none last:pb-0 border-gray-700`}
    >
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={todo.id} />
        <input type="hidden" name="completed" value={`${completed}`} />
        <button
          aria-label={`Mark task as ${completed ? "incomplete" : "complete"}`}
          disabled={editing || actionInProgress}
          name="intent"
          value="toggle completion"
          className="rounded-full border  p-1 transition disabled:pointer-events-none disabled:opacity-25 border-gray-700 hover:bg-gray-700"
        >
          {completed ? (
            <SquareCheckIcon className="h-4 w-4" />
          ) : (
            <SquareIcon className="h-4 w-4" />
          )}
        </button>
      </fetcher.Form>
      <div
        className={`flex-1 space-y-0.5 ${completed || actionInProgress ? "opacity-25" : ""
          }`}>
        <Link to={`/tasks/${todo.id}`}>
          <p>{title}</p>
          <div className="flex gap-2 text-xs">
            <p>
              Created at{" "}
              <time dateTime={`${new Date(todo.createdAt).toISOString()}`}>
                {dateFormatter.format(new Date(todo.createdAt))}
              </time>
            </p>
            {completed && (
              <p>
                Completed at{" "}
                <time dateTime={`${new Date(completedAt).toISOString()}`}>
                  {dateFormatter.format(new Date(completedAt))}
                </time>
              </p>
            )}
          </div>
        </Link>
      </div>
      <fetcher.Form
        method="post"
        className={`flex items-center gap-4 ${editing ? "flex-1" : ""}`}
        onSubmit={(event) => {
          const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement;
          if (
            submitter.value === "delete task" &&
            !confirm("Are you sure you want to delete this task?")
          ) {
            event.preventDefault();
            return;
          }
        }}
      >
        <input type="hidden" name="id" value={todo.id} />
        {!editing && (
          <button
            aria-label="Edit task"
            disabled={completed || actionInProgress}
            name="intent"
            value="edit task"
            className="rounded-full border border-gray-200 p-1 transition hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-25 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <EditIcon className="h-4 w-4" />
          </button>
        )}
        <button
          aria-label="Delete task"
          disabled={completed || editing || actionInProgress}
          name="intent"
          value="delete task"
          className="rounded-full border p-1 transition disabled:pointer-events-none disabled:opacity-25 border-gray-700 hover:bg-gray-700"
        >
          <DeleteIcon className="h-4 w-4" />
        </button>
      </fetcher.Form>
    </li >
  );
}