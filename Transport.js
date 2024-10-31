// interface Task {
//     id: string
//     title: string
//     description: string
//     dueDate: string
//     status: 'completed' | 'todo'
// }

// interface Filters {
//     title: string
//     dueDate: string
// }

export class Transport {
    constructor(client) {
        this.client = client;
    }

    getTasks(filters) {
        return this.client.getTasks(filters);
    }

    createTask(taskInfo) {
        return this.client.createTask(taskInfo)
    }

    updateTask(taskInfo) {
        return this.client.updateTask(taskInfo)
    }

    deleteTask(taskId) {
        return this.client.deleteTask(taskId);
    }

    changeStatus(taskId) {
        return this.client.changeStatus(taskId);
    }
}