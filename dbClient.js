import {filterTasks} from '/utils.js';

export class DbClient {
    constructor() {
        const db = window.indexedDB.open('todo-list-db')

        db.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('tasks')) {
                db.createObjectStore('tasks', {keyPath: 'id'});
            }
        };

        db.onsuccess = (event) => {
            this.taskTable = event.target.result;
        };

        db.onerror = (event) => {
            console.error(event)
        }
    }

    async getStore(mode = 'readonly', retries = 10) {
        return new Promise((resolve, reject) => {
            if (!this.taskTable) {
                if (retries > 0) {
                    setTimeout(() => {
                        return this.getStore(mode, retries - 1).then(resolve)
                    }, 400)
                    return
                } else {
                    reject('not initialized after multiple retries')
                }
            }
            const tx = this.taskTable.transaction('tasks', mode)
            return resolve(tx.objectStore('tasks'))
        })
    }

    getTasks(filters) {
        return new Promise(async (resolve) => {
            const store = await this.getStore()
            const request = store.openCursor()
            const tasks = []

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (filterTasks(cursor.value, filters)) {
                        tasks.push(cursor.value)
                    }

                    cursor.continue();
                } else {
                    resolve(tasks)
                }
            }
        })

    }

    createTask(taskInfo) {
        return new Promise(async (resolve) => {
            const transaction = await this.getStore('readwrite')
            const request = transaction.add({
                id: Math.random().toString(16).slice(2), // in the real world this id should be generated on the BE side
                ...taskInfo
            })

            request.onsuccess = () => {
                resolve()
            };
        })
    }

    updateTask(taskInfo) {
        return new Promise(async (resolve) => {
            const transaction = await this.getStore('readwrite')
            const request = transaction.get(taskInfo.id)

            request.onsuccess = (event) => {
                const task = event.target.result

                if (!task) {
                    return
                }

                const updateRequest = transaction.put({...task, ...taskInfo});

                updateRequest.onsuccess = () => {
                    resolve()
                }
            }
        })
    }

    deleteTask(id) {
        return new Promise(async (resolve) => {
            const transaction = await this.getStore('readwrite')
            const request = transaction.delete(id)

            request.onsuccess = () => {
                resolve()
            };
        })
    }

    async changeStatus(taskId) {
        return new Promise(async (resolve) => {
            const transaction = await this.getStore('readwrite')
            const request = transaction.get(taskId)

            request.onsuccess = (event) => {
                const task = event.target.result

                if (!task) {
                    return
                }

                task.status = task.status === 'todo' ? 'completed' : 'todo'
                const updateRequest = transaction.put(task);

                updateRequest.onsuccess = () => {
                    resolve()
                }
            }
        })
    }
}