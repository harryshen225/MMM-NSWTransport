Module.register("MMM-NSWTransport", {
	// Default module config.
	defaults: {
		stopNumber: 683,
		stopLine: null,
		updateInterval: 10
	},
	start: function () {
		var wrapper = document.createElement("div");
		wrapper.setAttribute("class", "content");
		wrapper.innerHTML = this.translate("WAIT_INFO");
		this.moduleContents = wrapper;

		this.sendSocketNotification("EMT_INIT", this.config);
		this.sendSocketNotification("EMT_LANGUAGE", config.language);
	},

	// Override dom generator.
	getDom: function () {
		return this.moduleContents;
	},
	getTranslations: function () {
		return {
			en: "translations/en.json",
			es: "translations/es.json",
			ca: "translations/ca.json"
		};
	},
	getStyles: function () {
		return [
			"font-awesome.css", // this file is available in the vendor folder, so it doesn't need to be available in the module folder.
			this.file("MMM-NSWTransport.css"), // this file will be loaded straight from the module folder.
		];
	},
	getHeader: function () {
		return this.data.header + " (" + this.translate("BUS_STOP") + ": " + this.config.stopNumber + ")";
	},

	// socketNotificationReceived: function (notification, payload) {
	// 	console.log("NSWtransport received"+notification);
	// }

	socketNotificationReceived: function (notification, payload) {
		console.log("NSWTransport received"+notification);
		if (notification === "BUS_INFO"){
			let buses = `<table>
			<thead>
				<tr>
					<th scope="col">Number</th>
					<th scope="col">Destination</th>
					<th scope="col">Due in</th>
				</tr>
			</thead>
			<tbody>`;

			var mainDiv = document.createElement("div");
			mainDiv.setAttribute("class", "content");

			var dataDiv = document.createElement("div");
			dataDiv.setAttribute("class", "table-content");
			mainDiv.appendChild(dataDiv);

			var updInfo = document.createElement("div");
			updInfo.setAttribute("class", "update-time");
			mainDiv.appendChild(updInfo);

			Log.info(this.name + ": Info is being processed.");

			payload.data.forEach(stopEvent => {
				buses +=`<tr>
					<td class='bus-details'><i class='fas fa-bus'></i> ${stopEvent.number} </td>
					<td class='bus-details'> ${stopEvent.destination} </td>
					<td id="due-in"> ${stopEvent.dueIn}</td>
				</tr>`;
			});
			if (payload.data.length == 0){ buses = "No Bus Information Retrieved"; }

			var d = new Date();
			updInfo.innerHTML = this.translate("UPDATED") + ": " + d.toString().substring(0, d.toString().indexOf("GMT")).trim();

			dataDiv.innerHTML = buses;
			this.moduleContents = mainDiv;

			this.updateDom();

		} else { Log.info(this.name + ": Unknown notification received (module)."); }
	},
});