export class DOMService {
    constructor() {
        const [filterTitle, filterDueDate] = document.querySelectorAll('.filter__controls .form__input')
        this.titleFilter = filterTitle
        this.dateFilterSearch = filterDueDate

        this.tasksTodoLayout = document.querySelector('.tasks.tasks__todo')
        this.tasksCompletedLayout = document.querySelector('.tasks.tasks__completed')

        const [title, description, dueDate] = document.querySelectorAll('.new-task__controls .form__input')
        this.addNewTaskBtn = document.querySelector('.new-task__button')
        this.newTaskTitle = title
        this.newTaskDescription = description
        this.newTaskDueDate = dueDate
    }

    renderTask(task, isEditMode) {
        const isCompletedTask = task.status === 'completed'

        const taskLayout = document.createElement('article')
        taskLayout.setAttribute('task_id', task.id)
        taskLayout.classList.add('task')

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.classList.add('task__checkbox')
        if (isCompletedTask || isEditMode) {
            checkbox.checked = true
        }

        let contentLayout = isEditMode ? this.renderEditableTaskContent(task) : this.renderViewTaskContent(task)

        const taskActions = this.renderTaskAction(isEditMode, isCompletedTask)

        taskLayout.append(checkbox)
        taskLayout.append(contentLayout)
        taskLayout.append(taskActions)

        if (isCompletedTask) {
            this.tasksCompletedLayout.append(taskLayout)
        } else {
            this.tasksTodoLayout.append(taskLayout)
        }
    }

    renderTaskAction(isEditMode, isCompletedTask) {
        const taskActions = document.createElement('div')
        taskActions.classList.add('task__actions')

        if (isEditMode) {
            const saveButton = document.createElement('button')
            saveButton.classList.add('task__button', 'task__button_save')
            saveButton.innerText = 'Save'
            taskActions.append(saveButton)
        } else {
            const editButton = document.createElement('button')
            editButton.classList.add('task__button', 'task__button_edit')
            editButton.innerText = 'Edit'
            if (isCompletedTask) {
                editButton.disabled = true
            }
            taskActions.append(editButton)
        }

        const deleteButton = document.createElement('button')
        deleteButton.classList.add('task__button', 'task__button_delete')
        deleteButton.innerText = 'Delete'
        if (isEditMode) {
            deleteButton.disabled = true
        }

        taskActions.append(deleteButton)

        return taskActions
    }

    renderEditableTaskContent(task) {
        const contentLayout = document.createElement('div')
        contentLayout.classList.add('task__content-layout')
        const taskContent = document.createElement('div')
        taskContent.classList.add('task__content')
        const taskTitle = document.createElement('input')
        taskTitle.classList.add('form__input', 'form__input_text')
        taskTitle.value = task.title
        const taskDescription = document.createElement('textarea')
        taskDescription.classList.add('form__input', 'form__textarea')
        taskDescription.value = task.description
        const taskDueDate = document.createElement('input')
        taskDueDate.type = 'date'
        taskDueDate.classList.add('form__input', 'form__input_date')
        taskDueDate.value = task.dueDate
        taskContent.append(taskTitle)
        taskContent.append(taskDescription)
        taskContent.append(taskDueDate)
        contentLayout.append(taskContent)

        return contentLayout
    }

    renderViewTaskContent(task) {
        const contentLayout = document.createElement('div')
        contentLayout.classList.add('task__content-layout')
        const taskContent = document.createElement('div')
        taskContent.classList.add('task__content')
        const taskTitle = document.createElement('h3')
        taskTitle.classList.add('task__title')
        taskTitle.innerText = task.title
        const taskDescription = document.createElement('p')
        taskDescription.classList.add('task__description')
        taskDescription.innerText = task.description
        const taskDueDate = document.createElement('p')
        taskDueDate.classList.add('task__due-date')
        taskDueDate.innerText = task.dueDate
        taskContent.append(taskTitle)
        taskContent.append(taskDescription)
        taskContent.append(taskDueDate)
        contentLayout.append(taskContent)

        return contentLayout
    }

    clearTaskLayout() {
        const removeTasks = (element) => {
            Array.from(element.querySelectorAll('article.task')).forEach((el) => el.remove())
        }

        removeTasks(this.tasksTodoLayout)
        removeTasks(this.tasksCompletedLayout)
    }

    getAddTaskButton() {
        return this.addNewTaskBtn
    }

    getTaskLayouts() {
        return {
            todoLayout: this.tasksTodoLayout,
            completedLayout: this.tasksCompletedLayout,
        }
    }

    getEditTaskFormFieldsValues(taskId) {
        const wrapper = document.querySelector(`article[task_id=${taskId}]`)
        const [title, description, dueDate] = wrapper.querySelectorAll('.form__input')

        return {
            title: title.value,
            description: description.value,
            dueDate: dueDate.value,
        }
    }

    getNewTaskFormFieldsValues() {
        return {
            title: this.newTaskTitle.value,
            description: this.newTaskDescription.value,
            dueDate: this.newTaskDueDate.value,
        }
    }

    clearNewTaskFormFieldsValues() {
        this.newTaskTitle.value = ''
        this.newTaskDescription.value = ''
        this.newTaskDueDate.value = ''
    }

    isDeleteButton(element) {
        return element.classList.contains('task__button_delete')
    }

    isEditButton(element) {
        return element.classList.contains('task__button_edit')
    }

    isSaveButton(element) {
        return element.classList.contains('task__button_save')
    }

    isChangeStatusCheckbox(element) {
        return element.classList.contains('task__checkbox')
    }

    getTaskIdByChildElement(element) {
        return element.closest('.task').getAttribute('task_id')
    }

    getFilterFields() {
        return {
            title: this.titleFilter,
            dueDate: this.dateFilterSearch
        }
    }
}