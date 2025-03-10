Ich habe dieses Script lediglich übernommen, um es wieder funktionsfähig zu machen und ggf. weiter auszubauen, 
da das Original seit 4 Jahren keine Updates mehr erhalten hat.  
Das Script stammt von hier: [https://github.com/eckertj/MVG-Abfahrtsmonitor](https://github.com/eckertj/MVG-Abfahrtsmonitor) (Autor [@eckertj](https://github.com/eckertj)).



# MVG Abfahrtsmonitor Widget (Scriptable)

![image](https://user-images.githubusercontent.com/4943203/108132598-6885fb00-70b3-11eb-9742-c9d3ac7691c3.png)

Dieses Widget zeigt aktuelle Abfahrten von Bus, Bahn und/oder Tram des Münchner Verkehrs- und Tarifverbunds für eine definierte Haltestelle an. Die Daten hierfür stammen von mvg.de. Unterstützt werden iOS 14 und macOS 11 Big Sur Widgets in klein, mittel und groß.

Im Widget-Parameter kann die Haltestelle per Namen definiert werden. Genaue Bezeichnungen der Haltestellen können hier eingesehen werden: [MVG Website](https://www.mvg.de/dienste/abfahrtszeiten.html) 

## Widget zu Scriptable hinzufügen

 1. Scriptable App öffnen
 2. Oben auf das "+" drücken
 3. Content aus [MVG-Abfahrtsmonitor.js](https://raw.githubusercontent.com/eckertj/MVG-Abfahrtsmonitor/master/MVG-Abfahrtsmonitor.js) in das Script kopieren (darauf achten, dass wirklich alle Zeichen mitkopiert werden)
 4. Done

## Installation des Widgets

 1. Lange auf eine App auf dem Home-Screen drücken.
 2. "Home-Bildschirm bearbeiten" auswählen.
 3. Oben auf das "+" drücken
 4. Runterscrollen bis "Scriptable" in der Liste erscheint.
 5. Gewünschte Widgetgröße auswählen.
 6. Auf das neue Widget drücken.
 7. Bei Script "MVG-Abfahrtsmonitor" auswählen.
 8. Bei When Interacting 'Run Script' auswählen.
 9. Bei Parameter gewünsche Haltestelle eingeben
 10. Fertig. Später kann die Haltestelle angepasst werden, wenn lange auf das Widget gedrückt wird und "Scriptable/Widget bearbeiten" ausgewählt wird.

Hinweis: Es können mehrere Widgets auf den Home Screen gelegt und individuell konfiguriert werden!

## Erweiterte Konfiguration vom Widget
In diesem Bereich:
```
// Transportmittel auswählen true für Anzeige und false für keine Anzeige
const bus = true;
const regionalBus = true;
const ubahn = true;
const sbahn = true;
const tram = true;
const zug = false;
const offsetInMinutes = 0; // Es werden erst Verbindungen angezeigt, die X Minuten in der Zukunft liegen
```
kann noch eingestellt werden, welche Transportmittel man angezeigt bekommen möchte.
Für Anzeige den Wert auf ```true```setzen und für Ausblenden den Wert auf ```false```setzen.
Unter ```offsetInMinutes``` kann man noch einen Offset eintragen um so z.b. seine Laufzeit zur Haltestelle abzuziehen.
Der Wert bewirkt dass dann nur Abfahrten in X Minuten angezeigt werden.


## Requirements
- Apple Device mit iOS 14 oder Apple Mac macOS 11 Big Sur
-  [Scriptable](https://scriptable.app)

## Credits
- [MVG-Widget](https://github.com/ChristophObermeier/iOS-Widgets/tree/main/MVG-Widget) von [ChristophObermeier](https://github.com/ChristophObermeier) 
- [Sonntagsfrage](https://github.com/henningtillmann/sonntagsfrage) von [henningtillmann](https://github.com/henningtillmann)
