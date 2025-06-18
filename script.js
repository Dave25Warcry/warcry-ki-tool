document.addEventListener('DOMContentLoaded', () => {
    const decisionTree = {
        "Startpunkt": {
            question: "Willkommen bei HackThor, dem ultimativen KI-Gegner für Warcry.",
            options: [
                { text: "Start", next: "Kampfpruefung" }
            ]
        },
        "Kampfpruefung": {
            question: "Befindet sich der ausgewählte KI-Kämpfer im Nahkampf?",
            options: [
                { text: "Ja", next: "Attackenpruefung" },
                { text: "Nein", next: "MissionszielBewegung" }
            ]
        },
        "Attackenpruefung": {
            question: "Kann der KI-Kämpfer in dieser Aktivierung noch eine Aktion ausführen?",
            options: [
                { text: "Ja", next: "AktionenVerfuegbarAuswahl" },
                { text: "Nein", next: "Ergebnis_KeineAktionKampf" }
            ]
        },
        "AktionenVerfuegbarAuswahl": {
            question: "Welche Aktion soll der KI-Kämpfer ausführen?",
            options: [
                { text: "Absetzen", next: "Ergebnis_Absetzen" },
                { text: "Attackenaktion", next: "Ergebnis_AttackenAktionAusgefuehrt" } // GEÄNDERT: Neuer Knoten hier
            ]
        },
        // NEUER KNOTEN FÜR DEN INFOTEXT
        "Ergebnis_AttackenAktionAusgefuehrt": {
            result: "Der KI-Kämpfer führt eine Attackenaktion aus.",
            nextCyclePassage: "GegnerAusgeschaltet" // Leitet danach zum nächsten Schritt weiter
        },
        // ENDE NEUER KNOTEN

        "GegnerAusgeschaltet": {
            question: "Ist der Gegner ausgeschaltet?",
            options: [
                { text: "Ja", next: "Ergebnis_GegnerBesiegt" },
                { text: "Nein", next: "Weiter_Attackenpruefung" }
            ]
        },
        "Weiter_Attackenpruefung": {
            result: "",
            nextCyclePassage: "Attackenpruefung"
        },
        "Ergebnis_GegnerBesiegt": {
            result: "Zurück zu: Befindet sich der ausgewählte KI-Kämpfer im Nahkampf?",
            nextCyclePassage: "Kampfpruefung"
        },
        "Ergebnis_AttackenAusfuehren": { // Dieser Knoten ist jetzt wahrscheinlich überflüssig und könnte entfernt werden
            result: "Die KI würde jetzt Attackenaktionen ausführen.",
            nextCyclePassage: "Attackenpruefung"
        },
        "Ergebnis_Absetzen": {
            result: "Der KI-Kämpfer führt eine Absetzaktion aus.",
            nextCyclePassage: "Kampfpruefung"
        },
        "Ergebnis_KeineAktionKampf": {
            result: "Die KI hat keine Aktionen mehr. Wähle ggf. einen anderen KI-Kämpfer aus.",
            nextCyclePassage: "Kampfpruefung"
        },
        "MissionszielBewegung": {
            question: "Ist eine Bewegungsaktion zum Missionsziel möglich?",
            options: [
                { text: "Ja", next: "MissionszielSicher" },
                { text: "Nein", next: "GegnerAlsZielVorhanden" }
            ]
        },
        "MissionszielSicher": {
            question: "Ist das Missionsziel erreicht und sicher?",
            options: [
                { text: "Ja", next: "MissionAbgeschlossen" },
                { text: "Nein", next: "GegnerReichweiteMissionsziel" }
            ]
        },
        "MissionAbgeschlossen": {
            question: "Ist die gesamte Mission abgeschlossen?",
            options: [
                { text: "Ja", next: "MissionAbgeschlossen_Folgeaktion" },
                { text: "Nein", next: "Missionsziel_BewegungOderNichts" }
            ]
        },
        "MissionAbgeschlossen_Folgeaktion": {
            question: "Was soll der KI-Kämpfer nach Missionsabschluss tun?",
            options: [
                { text: "Keine Aktion", next: "Ergebnis_KeineAktionKampf" },
                { text: "KI-Kämpfer im Kampf?", next: "Kampfpruefung" }
            ]
        },
        "Ergebnis_MissionAbgeschlossen": {
            result: "Die KI wäre jetzt inaktiv oder wartet auf neue Befehle.",
            nextCyclePassage: "Startpunkt"
        },
        "Ergebnis_VerharrenAmZiel": {
            result: "Die KI würde jetzt am Missionsziel verharren und die Umgebung sichern.",
            nextCyclePassage: "Kampfpruefung"
        },
        "GegnerReichweiteMissionsziel": {
            question: "Ist ein Gegner in Attackenreichweite, der das Missionsziel bedroht?",
            options: [
                { text: "Ja", next: "Ergebnis_AttackenAktionAusgefuehrt" }, // GEÄNDERT: Neuer Knoten hier
                { text: "Nein", next: "Missionsziel_BewegungOderNichts" }
            ]
        },
        "Missionsziel_BewegungOderNichts": {
            question: "Was soll der KI-Kämpfer tun, wenn der Gegner nicht in Attackenreichweite ist?",
            options: [
                { text: "Bewegung in Attackenreichweite", next: "Ergebnis_BewegungFeindlicherKaempfer" },
                { text: "Keine Aktion", next: "Ergebnis_KeineAktionMissionsziel" }
            ]
        },
        "Ergebnis_BewegungFeindlicherKaempfer": {
            result: "Der KI-Kämpfer führt eine Bewegungsaktion in Richtung des feindlichen Kämpfer aus.",
            nextCyclePassage: "Attackenpruefung"
        },
        "Ergebnis_AngriffMissionsziel": { // Dieser Knoten ist jetzt wahrscheinlich überflüssig
            result: "Die KI würde jetzt Attackenaktionen ausführen, um das Missionsziel zu sichern.",
            nextCyclePassage: "MissionszielSicher"
        },
        "BewegungReichweiteMissionsziel": {
            question: "Soll sich der Kämpfer in Attackenreichweite zu diesem Gegner bewegen?",
            options: [
                { text: "Ja", next: "Ergebnis_BewegenUndAngreifenMissionsziel" },
                { text: "Nein", next: "Ergebnis_KeineAktionMissionsziel" }
            ]
        },
        "Ergebnis_BewegenUndAngreifenMissionsziel": {
            result: "Die KI würde sich in Attackenreichweite zum Gegner bewegen und dann angreifen.",
            nextCyclePassage: "MissionszielSicher"
        },
        "Ergebnis_KeineAktionMissionsziel": {
            result: "Die KI hat keine Aktionen mehr. Wähle ggf. einen anderen KI-Kämpfer aus.",
            nextCyclePassage: "Kampfpruefung"
        },
        "GegnerAlsZielVorhanden": {
            question: "Gibt es einen Gegner, der als primäres Ziel markiert oder vorhanden ist?",
            options: [
                { text: "Ja", next: "GegnerReichweiteOhneMissionsziel" },
                { text: "Nein", next: "Kampfpruefung" }
            ]
        },
        "Ergebnis_KeineAktionKeinZiel": {
            result: "Die KI hat keine Aktionen mehr. Wähle ggf. einen anderen KI-Kämpfer aus.",
            nextCyclePassage: "Kampfpruefung"
        },
        "GegnerReichweiteOhneMissionsziel": {
            question: "Ist der Gegner in Attackenreichweite?",
            options: [
                { text: "Ja", next: "Ergebnis_AttackenAktionAusgefuehrt" }, // GEÄNDERT: Neuer Knoten hier
                { text: "Nein", next: "GegnerReichweiteOhneMissionsziel_AktionAuswahl" }
            ]
        },
        "GegnerReichweiteOhneMissionsziel_AktionAuswahl": {
            question: "Was soll der KI-Kämpfer tun, wenn der Gegner nicht in Attackenreichweite ist?",
            options: [
                { text: "Bewegung in Attackenreichweite", next: "Ergebnis_BewegungFeindlicherKaempfer" },
                { text: "Keine Aktion", next: "Ergebnis_KeineAktionOhneMissionsziel" }
            ]
        },
        "Ergebnis_AngriffOhneMissionsziel": { // Dieser Knoten ist jetzt wahrscheinlich überflüssig
            result: "Die KI würde jetzt Attackenaktionen ausführen.",
            nextCyclePassage: "Kampfpruefung"
        },
        "BewegungReichweiteOhneMissionsziel": {
            question: "Soll sich der Kämpfer in Attackenreichweite zu diesem Gegner bewegen?",
            options: [
                { text: "Ja", next: "Ergebnis_BewegenUndAngreifenOhneMissionsziel" },
                { text: "Nein", next: "Ergebnis_KeineAktionOhneMissionsziel" }
            ]
        },
        "Ergebnis_BewegenUndAngreifenOhneMissionsziel": {
            result: "Die KI würde sich in Attackenreichweite zum Gegner bewegen und dann angreifen.",
            nextCyclePassage: "Kampfpruefung"
        },
        "Ergebnis_KeineAktionOhneMissionsziel": {
            result: "Die KI hat keine Aktionen mehr. Wähle ggf. einen anderen KI-Kämpfer aus.",
            nextCyclePassage: "Kampfpruefung"
        }
    };

    let currentPassageId = "Startpunkt";
    let history = [];

    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const backButton = document.getElementById('back-button');
    const resultArea = document.getElementById('result-area');
    const resultTextElement = document.getElementById('result-text');
    const restartButton = document.getElementById('restart-button');
    const questionArea = document.getElementById('question-area');

    const AUTOCYCLE_DELAY_MS = 4000;
    let autoCycleTimeoutHandle;

    function displayPassage(passageId) {
        if (autoCycleTimeoutHandle) {
            clearTimeout(autoCycleTimeoutHandle);
        }

        const passage = decisionTree[passageId];

        if (!passage) {
            console.error("Passage mit ID '" + passageId + "' nicht gefunden im decisionTree. Bitte Code überprüfen.");
            questionTextElement.textContent = "Ein interner Fehler ist aufgetreten. Bitte laden Sie die Seite neu.";
            optionsContainer.innerHTML = '';
            resultArea.style.display = 'none';
            questionArea.style.display = 'block';
            backButton.style.display = 'none';
            restartButton.style.display = 'block';
            return;
        }

        if (passage.result !== undefined) {
            questionArea.style.display = 'none';
            resultArea.style.display = 'block';
            resultTextElement.textContent = passage.result;

            if (passage.nextCyclePassage) {
                optionsContainer.innerHTML = '';
                backButton.style.display = 'none';
                restartButton.style.display = 'none';

                const delay = (passage.result === "") ? 0 : AUTOCYCLE_DELAY_MS;

                autoCycleTimeoutHandle = setTimeout(() => {
                    currentPassageId = passage.nextCyclePassage;
                    displayPassage(currentPassageId);
                }, delay);
            } else {
                backButton.style.display = history.length > 0 ? 'block' : 'none';
                restartButton.style.display = 'block';
            }
        } else {
            questionArea.style.display = 'block';
            resultArea.style.display = 'none';
            questionTextElement.textContent = passage.question;
            optionsContainer.innerHTML = '';

            passage.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.onclick = () => {
                    history.push(currentPassageId);
                    currentPassageId = option.next;
                    displayPassage(currentPassageId);
                };
                optionsContainer.appendChild(button);
            });

            backButton.style.display = history.length > 0 ? 'block' : 'none';
            restartButton.style.display = 'none';
        }
    }

    backButton.addEventListener('click', () => {
        if (autoCycleTimeoutHandle) {
            clearTimeout(autoCycleTimeoutHandle);
        }
        if (history.length > 0) {
            currentPassageId = history.pop();
            displayPassage(currentPassageId);
        }
    });

    restartButton.addEventListener('click', () => {
        if (autoCycleTimeoutHandle) {
            clearTimeout(autoCycleTimeoutHandle);
        }
        currentPassageId = "Startpunkt";
        history = [];
        displayPassage(currentPassageId);
    });

    displayPassage(currentPassageId);
});