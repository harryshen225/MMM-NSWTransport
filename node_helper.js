var NodeHelper = require("node_helper");
var fs = require("fs");
const moment = require("moment");
const axios = require("axios");
require("moment-duration-format");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting stop fetcher for: " + this.name);
    },

    socketNotificationReceived: function (notification, payload) {
        var self = this;
        console.log(notification);

        switch (notification) {

            case "EMT_LANGUAGE":
                var lFile = "./modules/MMM-NSWTransport/translations/" + payload + ".json";
                var lCont;

                if (fs.existsSync(lFile)) {
                    lCont = fs.readFileSync("./modules/MMM-NSWTransport/translations/" + payload + ".json");
                } else {
                    lCont = fs.readFileSync("./modules/MMM-NSWTransport/translations/en.json");
                }

                this.langFile = JSON.parse(lCont);
                break;
            case "EMT_INIT":
                this.config = payload;
                setInterval(function () {
                    self.updateBusInfo();
                }, this.config.updateInterval * 1000);
                break;
            default:
                console.log(this.name + ": Unknown notification received (helper).");
        }
    },

    updateBusInfo: function () {

        console.log(this.name + ': Received request to update info.');

        var self = this;
        const url = "https://api.transport.nsw.gov.au/v1/tp/departure_mon?"
            + "outputFormat=rapidJSON"
            + "&coordOutputFormat=EPSG%3A4326"
            + "&mode=direct"
            + "&type_dm=stop"
            + "&name_dm=" + this.config.stopNumber
            + "&departureMonitorMacro=true"
            + "&excludedMeans=checkbox"
            + "&exclMOT_1=1"
            + "&exclMOT_4=1"
            + "&exclMOT_7=1"
            + "&exclMOT_9=1"
            + "&exclMOT_11=1"
            + "&TfNSWDM=true"
            + "&version=10.2.1.42";

        axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `apikey ${this.config.apiKey}`
            }
        }).then(res => {
            const outputTable = [];

            res.data.stopEvents.slice(0,this.config.latestN).forEach(stopEvent => {
                const outputRow = {
                    number: stopEvent.transportation.number,
                    destination: stopEvent.transportation.destination.name,
                    planned: moment(stopEvent.departureTimePlanned).format("hh:mm:ss a")
                };
                if (stopEvent.isRealtimeControlled) {
                    outputRow["estimated"] = moment(stopEvent.departureTimeEstimated).format("hh:mm:ss a");
                    outputRow["dueIn"] = moment.duration(moment(stopEvent.departureTimeEstimated).diff(moment())).format("h:mm:ss");
                } else {
                    outputRow["estimated"] = outputRow["planned"];
                    outputRow["dueIn"] = moment.duration(moment(stopEvent.departureTimePlanned).diff(moment())).format("h:mm:ss");
                }
                if (moment.duration(outputRow["dueIn"]) > 0) outputTable.push(outputRow);
            });
            self.sendSocketNotification("BUS_INFO", { data: outputTable });
        }).catch(err => {
            console.log(err);
        });

    },

});