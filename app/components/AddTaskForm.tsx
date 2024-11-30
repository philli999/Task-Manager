import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";


interface AddTaskFormProps {
    onClose: () => void;
  }  

export default function AddTaskForm({ onClose}: AddTaskFormProps) {
    const fetcher = useFetcher();
    // const addFormRef = useRef<HTMLFormElement>(null);
    // const addInputRef = useRef<HTMLInputElement>(null);

    const isAdding =
        fetcher.state === "submitting" &&
        fetcher.formData?.get("intent") === "create task";

        useEffect(() => {
            if (isAdding) {
                onClose();
            }
        }, [isAdding, onClose]);

    return (
        <>
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <fetcher.Form
            method="post"
            //   ref={addFormRef}
            className="rounded-xl borderborder-gray-700 bg-muted"
        >
            <fieldset
                disabled={isAdding}
                className="grid items-center gap-2 p-6 text-sm disabled:pointer-events-none disabled:opacity-25"
            >
                <input
                    type="text"
                    name="title"
                    //   ref={addInputRef}
                    placeholder="Create a new todo..."
                    required
                    className="flex-1 rounded-full border-2 px-3 py-2 text-sm font-bold text-white border-white/50"
                />
                <input
                    type="text"
                    name="description"
                    //   ref={addInputRef}
                    placeholder="Add a description..."
                    required
                    className="flex-1 rounded-full border-2 px-3 py-2 text-sm font-bold text-white border-white/50"
                />
                <button
                    name="intent"
                    value="create task"
                    className="rounded-full border-2 border-gray-200/50 bg-dark px-3 py-2 text-base transition hover:scale-105 hover:border-gray-500 sm:px-6 dark:border-white/50  dark:hover:border-white"
                >
                    {isAdding ? "Adding..." : "Add"}
                </button>
            </fieldset>
        </fetcher.Form>
        </>
    );
}

