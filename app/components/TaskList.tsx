import TaskItem from "~/components/TaskItem";
import { useFetchers } from "@remix-run/react";
import { Task } from "@prisma/client";

export default function TaskList({
    todos
}: {
    todos: Task[];
}) {
    const fetchers = useFetchers();

    const isDeleting = fetchers.some(
        (fetcher) =>
            fetcher.state !== "idle" &&
            fetcher.formData?.get("intent") === "delete task"
    );

    const deletingTodoIds = fetchers
        .filter(
            (fetcher) =>
                fetcher.state !== "idle" &&
                fetcher.formData?.get("intent") === "delete task"
        )
        .map((fetcher) => fetcher.formData?.get("id"));

    if (todos.length === 0) {
        return (
            <p className="text-center leading-7">
                "No tasks available"
            </p>
        );
    }

    return (
        <ul>
            {todos.map((todo) => (
                <TaskItem key={todo.id} todo={todo} />
            ))}
        </ul>
    );
}