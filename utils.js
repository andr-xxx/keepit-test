export const debounce = (cb, tm) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb.apply(this, args)
        }, tm)
    }
}

export const filterTasks = (task, filters) => {
    return (!filters.title || task.title.includes(filters.title)) && (!filters.dueDate || task.dueDate === filters.dueDate);
}