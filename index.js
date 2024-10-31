import {Transport} from './Transport.js'
import {DbClient} from './dbClient.js'
import {DOMService} from './DOMService.js'
import {debounce} from './utils.js'

(function () {
    const dbTransport = new Transport(new DbClient());
    const domService = new DOMService();

    class TodoListController {
        constructor(transport, domService) {
            this.transport = transport;
            this.domService = domService;
            this.editedTaskId = null

            this.filters = {
                title: '', dueDate: '',
            }

            this.renderTasks(this.filters);
            this.runListeners();
        }

        async renderTasks(filters) {
            const tasks = await this.transport.getTasks(filters)
            this.domService.clearTaskLayout()
            tasks.forEach((task) => this.domService.renderTask(task, task.id === this.editedTaskId))
        }

        addNewTask() {
            this.domService.getAddTaskButton().addEventListener('click', async () => {
                await this.transport.createTask({
                    ...this.domService.getNewTaskFormFieldsValues(), status: 'todo',
                })

                await this.renderTasks(this.filters)
                this.domService.clearNewTaskFormFieldsValues()
            })
        }

        manageTask() {
            const listener = async (event) => {
                const taskId = this.domService.getTaskIdByChildElement(event.target)
                if (this.domService.isDeleteButton(event.target)) {
                    await this.transport.deleteTask(taskId)
                } else if (this.domService.isChangeStatusCheckbox(event.target)) {
                    await this.transport.changeStatus(taskId)
                } else if (this.domService.isEditButton(event.target)) {
                    this.editedTaskId = taskId
                } else if (this.domService.isSaveButton(event.target)) {
                    this.editedTaskId = null
                    this.transport.updateTask({id: taskId, ...this.domService.getEditTaskFormFieldsValues(taskId)})
                } else {
                    return
                }

                await this.renderTasks(this.filters)
            }

            const {todoLayout, completedLayout} = this.domService.getTaskLayouts()

            todoLayout.addEventListener('click', listener)
            completedLayout.addEventListener('click', listener)
        }

        applyFilters() {
            const {title, dueDate} = this.domService.getFilterFields()

            const callback = debounce((event) => {
                this.filters.title = event.target.value
                this.renderTasks(this.filters)
            })

            title.addEventListener('input', callback)

            dueDate.addEventListener('change', (event) => {
                this.filters.dueDate = event.target.value
                this.renderTasks(this.filters)
            })
        }

        runListeners() {
            this.addNewTask()
            this.manageTask()
            this.applyFilters()
        }
    }

    new TodoListController(dbTransport, domService)
})()