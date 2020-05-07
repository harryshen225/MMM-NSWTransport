# Module: MMM-NSWTransport
This is a magicMirror module which provide real-time bus schedule information for any give bus stop ID

## Dependencies
- axios
- fs
- moment.js
- moment-duration-format

## Installation

Navigate into your MagicMirror's `modules` folder:
```
cd ~/MagicMirror/modules
```

Clone this repository:
```
git clone https://github.com/harryshen225/MMM-NSWTransport.git
```

Navigate to the new `MMM-NSWTransport` folder and install the node dependencies.
```
npm install
```

Configure the module in your `config.js` file.

## Find your stop number
Use the following Link to find the stop number.

[Find your Stop Number](https://transportnsw.info/routes/details/state-transit/146/28146)


## Using the module

To use this module, add it to the modules array in the `config/config.js` file. 

```javascript
modules: [
  {
			module: "MMM-NSWTransport",
			position: "top_right",
			header: "My bus stop",
			config: {
				stopNumber: 2099117,
				latestN: 12,
				updateInterval: 6,
				apiKey: "****************"
			}
		},
]
```

## Configuration options

The following properties can be configured:

| Option                       | Description
| ---------------------------- | -----------
| `stopNumber`                 | ID number of the bus stop.<br><br>**Required**<br>**Value type:** `Integer`<br>**Default value:** `683`
| `lastestN`                 | Display the latest N record 
| `apiKey` | obtain the API key from https://opendata.transport.nsw.gov.au
| `updateInterval`             | Time (in seconds) to wait before refreshing the data from the API.<br><br>**Required**<br>**Value type:** `Integer`<br>**Default value:** `10`
