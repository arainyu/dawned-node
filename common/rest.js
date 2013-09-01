var responseStatus = {
	ok: function(res, data) {
		res.json(200, {
			statusCode: 200,
			statusText: 'Ok',
			data: data || ""
		});
	},
	created: function(res, data) {
		res.json(201, {
			statusCode: 201,
			statusText: 'Created',
			data: data || ""
		});
	},
	updated: function(res, data, statusCode) {
		res.json(statusCode || 204, {
			statusCode: 204,
			statusText: 'Updated',
			data: data || ""
		});
	},
	notFound: function(res) {
		res.json(404, {
			statusCode: 404,
			statusText: 'Not Found!'
		});
	},
	notAcceptable: function(res) {
		res.json(406, {
			statusCode: 406,
			statusText: 'Not Acceptable!'
		});
	},
	internalServerError: function(res) {
		res.json(500, {
			statusCode: 500,
			statusText: 'Internal Server Error!'
		});
	},
	serviceUnavailable: function(res) {
		res.json(503, {
			statusCode: 503,
			statusText: 'Service Unavailable!'
		});
	}
};

var method = {
	GET: "get",
	POST: "post",
	PUT: "put",
	DELETE: "delete"
};

var API = {
	getById: function(req, res) {
		responseStatus.notFound(res);
	},
	getAll: function(req, res) {
		responseStatus.notFound(res);
	},
	search: function(req, res) {
		responseStatus.notFound(res);
	},
	post: function(req, res) {
		responseStatus.notFound(res);
	},
	put: function(req, res) {
		responseStatus.notFound(res);
	},
	delete: function(req, res) {
		responseStatus.notFound(res);
	}
};

var ApiResultModel = function(res, method) {
	this.type = method || method.GET;
	this.res = res;
};

ApiResultModel.prototype.checkAcceptable = function(notAcceptableCondition) {
	if (notAcceptableCondition) {
		responseStatus.notAcceptable(this.res);
		return false;
	}
	return true;
};

ApiResultModel.prototype.responseAPI = function(err, data, statusCode) {
	if (err) {
		responseStatus.internalServerError(this.res);
		return;
	}

	switch (this.type) {
		case method.POST:
			responseStatus.created(this.res, data);
			break;
		case method.PUT:
			responseStatus.updated(this.res, data, statusCode);
			break;
		case method.DELETE:
			responseStatus.ok(this.res, data);
			break;
		default:
			responseStatus.ok(this.res, data);
	}
};

exports.responseStatus = responseStatus;
exports.API = API;
exports.method = method;
exports.ApiResultModel = ApiResultModel;