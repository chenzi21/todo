export default class CDate extends Date {
	toDateTime() {
		return this.toISOString().slice(0, 19).replace("T", " ");
	}

	getLocalDateOffset() {
		const offset = this.getTimezoneOffset() / 60;
		if (offset > 9 || offset < -9) {
			return `${offset}:00`;
		}

		if (offset > 0) {
			return `0${offset}:00`;
		}

		return `-0${Math.abs(offset)}:00`;
	}

	toTimeInput() {
		return `${this.getHours().toString().padStart(2, "0")}:${this.getMinutes().toString().padStart(2, "0")}`;
	}

	setTimeInput(timeInputValue: string) {
		const [hours, minutes] = timeInputValue.split(":");
		this.setHours(Number(hours) ?? 0, Number(minutes) ?? 0, 0, 0);
		return this;
	}
}
