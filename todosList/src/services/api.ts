const API_BASE_URL = "http://localhost:5000";

export interface Todo {
    id: number;
    txt: string;
    completed: boolean;
}


export const getTodos = async (): Promise<Todo[]> => {
    const report = await fetch(`${API_BASE_URL}/todos`);
    return report.json();
};

export const createTodo = async (text: string): Promise<Todo> => {
    const report = await fetch(`${API_BASE_URL}/todos`,{
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({text, completed: false}),
    });
    return report.json();
};

export const updateTodo = async (id: number, text: string, completed: boolean): Promise<Todo> => {
    const report = await fetch(`${API_BASE_URL}/todos/${id}`,{
        method: "PUT",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({text, completed}),
    });
    return report.json();
}

export const deleteTodo = async (id: number): Promise<void> => {
    const report = await fetch(`${API_BASE_URL}/todos/${id}`,{
        method: "DELETE",

    });
    return report.json();
}