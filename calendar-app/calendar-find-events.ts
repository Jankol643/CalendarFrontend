  //Replaced createEvent with handleEvent
  private handleEvent(item: NCalendar.IEvent) {
    const newCalendarData = [...this.calendarData];

    const findEvent = this.findEvent(newCalendarData, item);

    if (!findEvent) {
        createEvent(newCalendarData, item);
    } else {
        updateEvent(newCalendarData, item, findEvent);
    }

    this.calendarData = newCalendarData;
}

  private createCalendarData() {
    const firstDayInMonth = getSelectedDate(this.date, 1).getDay();
    const previousMonth = getSelectedDate(this.date).getDate();


    for (let index = firstDayInMonth; index > 0; index--) {
        this.calendarData.push(templateCalendarData(previousMonth - (index - 1), getSelectedDate(this.date, previousMonth - (index - 1), -1)));
    }


    const daysInMonth = getSelectedDate(this.date, 0, 1).getDate();

    for (let index = 1; index <= daysInMonth; index++) {
        const newDate = getSelectedDate(this.date, index);

        this.calendarData.push(
            {
                ...templateCalendarData(index, newDate),
                isCurrentDay: formatDate(this.date) === formatDate(newDate),
                isCurrentMonth: true,
            }
        );
    }

    const calendarLength = this.calendarData.length;

    for (let index = 1; index <= (this.totalItems - calendarLength); index++) {
        this.calendarData.push(templateCalendarData(index, getSelectedDate(this.date, index, 1)));
    }

}

removeEvent(calendarIndex: number, eventIndex: number) {
    const newCalendarData = [...this.calendarData];
    newCalendarData[calendarIndex].events.splice(eventIndex, 1);
    this.calendarData = newCalendarData;
}

openModal() {
    this.dialogService.openDialog();
}

openModalEdit(event: NCalendar.IEvent) {
    this.dialogService.openDialog(event);
}