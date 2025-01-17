// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: subway;
/************************************************

MVG Abfahrtsmonitor Widget
Aktualisiert von @Nisbo (17.01.2025)
GitHub für Updates:
https://github.com/Nisbo/MVG-Abfahrtsmonitor

Dieses Widget zeigt aktuelle Abfahrten von Bus, Bahn
und/oder Tram des Münchner Verkehrs- und Tarifverbunds
für eine definierte Haltestelle an. 

Die Daten stammen von mvg.de. 
Unterstützt iOS 14 Widget in klein, mittel und groß.

Im Widget-Parameter kann die Haltestelle per Namen definiert
werden. Genaue Bezeichnungen der Haltestellen können
hier eingesehen werden:
https://www.mvg.de/verbindungen.html

Weiter unten im Script kann man noch einstellen
welche Transportmittel man sehen möchte

Installation des Widgets:
1. Lange auf eine App auf dem Home-Screen drücken.
2. "Home-Bildschirm bearbeiten" auswählen.
3. Oben auf das "+" drücken
4. Runterscrollen bis "Scriptable" in der Liste erscheint.
5. Gewünschte Widgetgröße auswählen.
6. Auf das neue Widget drücken.
7. Bei Script "MVG-Abfahrtsmonitor" auswählen.
8. Bei When Interacting 'Run Script' auswählen.
9. Bei Parameter gewünsche Haltestelle eingeben.
10. Fertig. Später kann die Haltestelle angepasst werden,
   wenn lange auf das Widget gedrückt wird und
   "Scriptable/Widget bearbeiten" ausgewählt wird.
    
Hinweis: Es können mehrere Widgets auf den Home Screen
gelegt und individuell konfiguriert werden!

************************************************
Original von von Jacob Eckert (letze Version 17.02.2021)
https://github.com/eckertj/MVG-Abfahrtsmonitor

Für dieses Widget gilt die Apache 2.0 Lizenz
https://github.com/eckertj/MVG-Abfahrtsmonitor/blob/master/LICENSE
************************************************/

// Transportmittel auswählen true für Anzeige und false für keine Anzeige
const bus = true;
const regionalBus = true;
const ubahn = true;
const sbahn = true;
const tram = true;
const zug = false;
const offsetInMinutes = 0; // Es werden erst Verbindungen angezeigt, die X Minuten in der Zukunft liegen

// Dont change anything below this line if you dont know what you are doing ;)
// Dont change anything below this line if you dont know what you are doing ;)
// Dont change anything below this line if you dont know what you are doing ;)
//const station = "Marienplatz" // For Debug in the App remove the //
const station = args.widgetParameter // For Debug in the App add // at the beginning of the line

//Adds "&" to combined station and replace umlauts
let clearstation = station.replace(" ","&").replace("ß","ss").replace("ü","ue").replace("ä","ae").replace("ö","oe")

//Get Station ID
const mvgstatID = "https://www.mvg.de/api/bgw-pt/v3/locations?query=" + clearstation
let responseID = await new Request(mvgstatID).loadJSON()

// Store the Global ID
let globalId = "";
if (responseID.length > 0) {
    // Extract the globalId of the first station
    const firstStation = responseID.find(entry => entry.type === "STATION");
    if (firstStation) {
        globalId = firstStation.globalId;
        //console.log("Global ID: " + globalId);
    } else {
        console.log("No station found in the response.");
    }
} else {
    console.log("No results found for the given query.");
}

// create transportTypes dynamically
const defaultTransportTypes = "SBAHN,UBAHN,TRAM,BUS,REGIONAL_BUS"; // dont change
let transportTypes = [];
if (bus) transportTypes.push("BUS");
if (regionalBus) transportTypes.push("REGIONAL_BUS");
if (ubahn) transportTypes.push("UBAHN");
if (sbahn) transportTypes.push("SBAHN");
if (tram) transportTypes.push("TRAM");
if (zug) transportTypes.push("BAHN");

// set default transportTypes
if (transportTypes.length === 0) {
    transportTypes = defaultTransportTypes.split(',');
}

// API Request
const mvgReq = "https://www.mvg.de/api/bgw-pt/v3/departures?globalId=" + globalId + "&limit=80&offsetInMinutes=" + offsetInMinutes + "&transportTypes=" + transportTypes.join(',');

// API Request durchführen
let response = await new Request(mvgReq).loadJSON();

//Calculates Departure time
function calculateTimeOffset(times) {
  return Math.ceil((times - Date.now()) / 60000)
}

//Calculates expected departure incl. delay
function calculateDeparture (delay, time) {
  if (delay == undefined) {
    return time
  } else {
    return delay+time
  }
}

//Shorten text, if length exceeds space
function truncate(text, n = 22) {
  return (text.length > n) ? text.substr(0, n-1) + '...' : text
}

function createDateString() {
  const now = new Date(Date.now())

  let day = (now.getDate().toString().length > 1) ? now.getDate().toString() : "0" + now.getDate().toString()
  let monthNumb = now.getMonth() + 1
  let month = (monthNumb.toString().length > 1) ? monthNumb.toString() : "0" + monthNumb.toString()
  let year = now.getFullYear().toString()
  let hours = (now.getHours().toString().length > 1) ? now.getHours().toString() : "0" + now.getHours().toString()
  let minutes = (now.getMinutes().toString().length > 1) ? now.getMinutes().toString() : "0" + now.getMinutes().toString()

  return "Updated: " + day + "." + month + "." + year + " - " + hours + ":" + minutes
}


function getLineColor(transportType, label) {
    switch (transportType) {
        case "UBAHN":
            switch (label) {
                case "U1": return "#438136";
                case "U2": return "#C40C37";
                case "U3": return "#F36E31";
                case "U4": return "#0AB38D";
                case "U5": return "#B8740E";
                case "U6": return "#006CB3";
                default:
                    return "#000000";
            }
        case "SBAHN":
            switch (label) {
                case "S1": return "#16BAE7";
                case "S2": return "#76B82A";
                case "S3": return "#951B81";
                case "S4": return "#E30613";
                case "S5": return "#005E82";
                case "S6": return "#00975F";
                case "S7": return "#943126";
                case "S8": return "#000000";
                case "S20": return "#ED6B83";
                default: return "#FFFFFF"; // Standard (White)
            }
        case "BUS":          return "#00586A";
        case "REGIONAL_BUS": return "#4682B4";
        case "TRAM":         return "#D82020";
        default:
            return "#FFFFFF"; // Standard (White)
    }
}

const widgetSize = (config.widgetFamily ? config.widgetFamily : 'large');
const widget = await createWidget()

if (!config.runInWidget) {
  switch(widgetSize) {
    case 'small':
    await widget.presentSmall();
    break;

    case 'large':
    await widget.presentLarge();
    break;
    
    default:
    await widget.presentMedium();
  }
}

Script.setWidget(widget)

function createWidget() {
  let ITEMS_COUNT
  let HEADER_SIZE
  let COLUMN_HEIGHT
  let SPACING
  let PADDING
  let LOGO_SIZE
  let STATION_SIZE
  let DEPART_SIZE
  let LOGO_FONT_SIZE
  let STATION_FONT_SIZE
  let DEPART_FONT_SIZE
  let HEADLINE_FONT_SIZE
  let FOOTER_HEIGHT
  let FOOTER_FONT_SIZE

  if (widgetSize == 'small') {
    ITEMS_COUNT = 4
    HEADER_SIZE = 20
    COLUMN_HEIGHT = 15
    SPACING = 3
    PADDING = SPACING
    LOGO_SIZE = new Size(20, COLUMN_HEIGHT)
    STATION_SIZE = new Size(80, COLUMN_HEIGHT)
    DEPART_SIZE = new Size(20, COLUMN_HEIGHT)
    LOGO_FONT_SIZE = 12
    STATION_FONT_SIZE = 14
    DEPART_FONT_SIZE = 12
    HEADLINE_FONT_SIZE = 16
    FOOTER_HEIGHT = 20
    FOOTER_FONT_SIZE = 6
  } else if (widgetSize == 'medium') {
    ITEMS_COUNT = 3
    HEADER_SIZE = 25
    COLUMN_HEIGHT = 20
    SPACING = 5
    PADDING = SPACING
    LOGO_SIZE = new Size(35, COLUMN_HEIGHT)
    STATION_SIZE = new Size(185, COLUMN_HEIGHT)
    DEPART_SIZE = new Size(60, COLUMN_HEIGHT)
    LOGO_FONT_SIZE = 14
    STATION_FONT_SIZE = 20
    DEPART_FONT_SIZE = 16
    HEADLINE_FONT_SIZE = 24
    FOOTER_HEIGHT = 10
    FOOTER_FONT_SIZE = 8
  } else {
    ITEMS_COUNT = 8
    HEADER_SIZE = 30
    COLUMN_HEIGHT = 20
    SPACING = 5
    PADDING = SPACING
    LOGO_SIZE = new Size(35, COLUMN_HEIGHT)
    STATION_SIZE = new Size(185, COLUMN_HEIGHT)
    DEPART_SIZE = new Size(60, COLUMN_HEIGHT)
    LOGO_FONT_SIZE = 14
    STATION_FONT_SIZE = 20
    DEPART_FONT_SIZE = 16
    HEADLINE_FONT_SIZE = 24
    FOOTER_HEIGHT = 25
    FOOTER_FONT_SIZE = 8
  }

  // Widget
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#4562a2")
  widget.setPadding(PADDING, PADDING, PADDING, PADDING);

  // Main stack
  const stack = widget.addStack();
  stack.layoutVertically();
  stack.centerAlignContent()

  // Top stack for station headline
  const topStack = stack.addStack();
  topStack.layoutVertically();
  //topStack.centerAlignContent()
  topStack.size = new Size(LOGO_SIZE.width + STATION_SIZE.width + DEPART_SIZE.width + 2*SPACING, HEADER_SIZE);

  const stationName = topStack.addText(station.toString());
  stationName.textColor = Color.white();
  stationName.leftAlignText()
  stationName.font = Font.boldSystemFont(HEADLINE_FONT_SIZE)

  // Horizontal spacer under headline (station) string
  stack.addSpacer(8);
  
  for (let i = 0; i < ITEMS_COUNT; i++) {
    // Will be set up with 3 columns to show line, destination and departure time
    const bottomStack = stack.addStack();
          bottomStack.spacing = SPACING
          bottomStack.size = new Size(LOGO_SIZE.width + STATION_SIZE.width + DEPART_SIZE.width + 2*SPACING, COLUMN_HEIGHT + 2*SPACING)
          bottomStack.layoutHorizontally();
          bottomStack.centerAlignContent()

    let transportType = response[i].transportType;
    let label = response[i].label;
    let lineColor = getLineColor(transportType, label);
    
    const linestack = bottomStack.addStack();
          linestack.size = LOGO_SIZE
          linestack.centerAlignContent()

    let lineName = linestack.addText(label)
        if (label === "U7") {
            linestack.backgroundColor = new Color("#C40C37");
            lineName.textColor = new Color("#438136");
        } else if (label === "U8") {
            linestack.backgroundColor = new Color("#F36E31");
            lineName.textColor = new Color("#C40C37");
        } else {
            linestack.backgroundColor = new Color(lineColor);
            lineName.textColor = Color.white(); // Standard Textcolor
        }

        lineName.font = Font.boldSystemFont(LOGO_FONT_SIZE)
        lineName.centerAlignText()
        lineName.minimumScaleFactor = 0.4
    
    const destinationStack = bottomStack.addStack();
          destinationStack.size = STATION_SIZE
          destinationStack.layoutVertically()
          destinationStack.bottomAlignContent()
          
    let destinationName = destinationStack.addText(truncate(response[i].destination.toString()))
        destinationName.font = Font.lightSystemFont(STATION_FONT_SIZE)
        destinationName.textColor = Color.white()
        destinationName.leftAlignText()
        destinationName.minimumScaleFactor = 0.95
    
    const departureStack = bottomStack.addStack();
          departureStack.size = DEPART_SIZE
          departureStack.bottomAlignContent()
    
    // Add ' Min' extension if we have space for that
    let extension = ""
    if (widgetSize == 'medium' ||  widgetSize == 'large') {
      extension = " Min"
    }

    // let departureTime = departureStack.addText(calculateDeparture(response[i].delayInMinutes,calculateTimeOffset(response[i].plannedDepartureTime)) + extension)
    let departureTime = departureStack.addText(calculateDeparture(0,calculateTimeOffset(response[i].realtimeDepartureTime)) + extension)
        departureTime.font = Font.boldSystemFont(DEPART_FONT_SIZE)
        departureTime.textColor = Color.white()
        departureTime.rightAlignText()
        departureTime.minimumScaleFactor = 0.95
  }

  const updatedstack = stack.addStack();
  updatedstack.bottomAlignContent()
  updatedstack.size = new Size(LOGO_SIZE.width + STATION_SIZE.width + DEPART_SIZE.width + 2*SPACING, FOOTER_HEIGHT)
  let lastUpdateTime = updatedstack.addText(createDateString())
  lastUpdateTime.font = Font.lightSystemFont(8)
  lastUpdateTime.textColor = Color.white()
  lastUpdateTime.rightAlignText()
  lastUpdateTime.textOpacity = 0.6
  lastUpdateTime.minimumScaleFactor = 0.95

  return widget;
}

Script.complete()
