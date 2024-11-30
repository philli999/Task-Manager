import { Task } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Outlet, redirect, useFetcher, useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { useRef, useState } from "react";
import TaskList from "~/components/TaskList";
import Modal from "~/components/Modal";
import AddTaskForm from "~/components/AddTaskForm";
import { prisma } from "~/utils/prisma.server";

export async function loader() {
    const tasks = await prisma.task.findMany();
    return { tasks };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const { intent, ...values } = Object.fromEntries(formData);

    switch (intent) {
        case "create task": {
            const { title, description } = values;
            if (!title) throw new Response("Title is required", { status: 400 });

            await prisma.task.create({
                data: {
                    title: title as string,
                    description: description as string,
                },
            });
            break;
        }
        case "toggle completion": {
            const { id, completed } = values;
            if (!id) throw new Response("Task ID is required", { status: 400 });

            const currentTask = await prisma.task.findUnique({ where: { id: Number(id) } });
            if (!currentTask) throw new Response("Task not found", { status: 404 });

            await prisma.task.update({
                where: { id: Number(id) },
                data: {
                    completed: !JSON.parse(completed as string),
                    completedAt: !JSON.parse(completed as string) ? new Date() : null,
                },
            });
            break;
        }
        case "edit task": {
            const { id } = values;
            if (!id) throw new Response("Task ID is required", { status: 400 });

            await prisma.task.update({
                where: { id: Number(id) },
                data: { editing: true },
            });
            break;
        }
        case "save task": {
            const { id, title, description } = values;
            if (!id || !title) throw new Response("Task ID and description are required", { status: 400 });

            await prisma.task.update({
                where: { id: Number(id) },
                data: {
                    title: title as string,
                    description: description as string,
                    editing: false,
                },
            });
            break;
        }
        case "delete task": {
            const { id } = values;
            if (!id) throw new Response("Task ID is required", { status: 400 });

            await prisma.task.delete({
                where: { id: Number(id) },
            });
            return redirect(`/tasks`);
            break;
        }
        case "clear completed": {
            await prisma.task.deleteMany({
                where: { completed: true },
            });
            break;
        }
        case "delete all": {
            await prisma.task.deleteMany({});
            break;
        }
        default: {
            throw new Response("Unknown intent", { status: 400 });
        }
    }

    return Response.json({ ok: true });
}


export default function Tasks() {

    const { tasks } = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const view = searchParams.get("view") || "all";
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex h-full">
            <div className="flex-1" >
            <h1 className="text-4xl underline font-bold text-center">Tasks</h1>
            <div className="grid gap-4 pt-5 px-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="justify-self-end px-4 py-2 bg-dark text-primary rounded hover:opacity-80"
                >
                    Add New Task
                </button>
                <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
                    <TaskList todos={tasks as unknown as Task[]} />
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => handleCloseModal()}>
                <AddTaskForm onClose={() => handleCloseModal()} />
            </Modal>
            </div>
            <Outlet />
        </div>)
}