class CountAnswer {

	constructor(type, answerType, recordId, teachinggroupId, usergroupId) {
		this._type = type; //下發試題類型 1 判斷題 2 單選題 4 多選題
		this._answerType = answerType; // 答題類型  1 全班作答 2 小組組長作答  3 全組組員作答
		this._recordId = recordId; //下發記錄ID
		this._teachinggroupId = teachinggroupId; // 教學組ID
		this._usergroupId = usergroupId; //  用戶組ID
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}

	get answerType() {
		return this._answerType;
	}

	set answerType(value) {
		this._answerType = value;
	}

	get teachinggroupId() {
		return this._teachinggroupId;
	}

	set teachinggroupId(value) {
		this._teachinggroupId = value;
	}

	get usergroupId() {
		return this._usergroupId;
	}

	set usergroupId(value) {
		this._usergroupId = value;
	}
}
module.exports = CountAnswer