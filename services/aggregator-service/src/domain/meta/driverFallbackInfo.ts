export interface DriverFallbackInfo {
    racingNumber: string;
    tla: string;
    broadcastName: string;
    fullName: string;
    firstName: string;
    lastName: string;
    teamName: string;
    teamColor: string;
}

// можно по умолчангию использовать сортировку по номерам пилотов
export const DRIVER_FALLBACK: Record<string, DriverFallbackInfo> = {
    "1": {
        racingNumber: "1",
        tla: "NOR",
        broadcastName: "L NORRIS",
        fullName: "Lando NORRIS",
        firstName: "Lando",
        lastName: "Norris",
        teamName: "McLaren",
        teamColor: "F47600"
    },

    "3": {
        racingNumber: "3",
        tla: "VER",
        broadcastName: "M VERSTAPPEN",
        fullName: "Max VERSTAPPEN",
        firstName: "Max",
        lastName: "Verstappen",
        teamName: "Red Bull Racing",
        teamColor: "4781D7",
    },

    "5": {
        racingNumber: "5",
        tla: "BOR",
        broadcastName: "G BORTOLETO",
        fullName: "Gabriel BORTOLETO",
        firstName: "Gabriel",
        lastName: "Bortoleto",
        teamName: "Audi",
        teamColor: "F50537",
    },

    "6": {
        racingNumber: "6",
        tla: "BOR",
        broadcastName: "I HADJAR",
        fullName: "Isack HADJAR",
        firstName: "Isack",
        lastName: "Hadjar",
        teamName: "Red Bull Racing",
        teamColor: "4781D7",
    },

    "10": {
        racingNumber: "10",
        tla: "GAS",
        broadcastName: "P GASLY",
        fullName: "Pierre GASLY",
        firstName: "Pierre",
        lastName: "Gasly",
        teamName: "Alpine",
        teamColor: "00A1E8",
    },

    "11": {
        racingNumber: "11",
        tla: "PER",
        broadcastName: "S PEREZ",
        fullName: "Sergio PEREZ",
        firstName: "Sergio",
        lastName: "Perez",
        teamName: "Cadillac",
        teamColor: "909090",
    },

    "12": {
        racingNumber: "12",
        tla: "ANT",
        broadcastName: "K ANTONELLI",
        fullName: "Kimi ANTONELLI",
        firstName: "Kimi",
        lastName: "Antonelli",
        teamName: "Mercedes",
        teamColor: "00D7B6",
    },

    "14": {
        racingNumber: "14",
        tla: "ALO",
        broadcastName: "F ALONSO",
        fullName: "Fernando ALONSO",
        firstName: "Fernando",
        lastName: "Alonso",
        teamName: "Aston Martin",
        teamColor: "229971",
    },

    "16": {
        racingNumber: "16",
        tla: "LEC",
        broadcastName: "C LECLERC",
        fullName: "Charles LECLERC",
        firstName: "Charles",
        lastName: "Leclerc",
        teamName: "Ferrari",
        teamColor: "ED1131",
    },

    "18": {
        racingNumber: "18",
        tla: "STR",
        broadcastName: "L STROLL",
        fullName: "Lance STROLL",
        firstName: "Lance",
        lastName: "Stroll",
        teamName: "Aston Marti",
        teamColor: "229971",
    },

    "23": {
        racingNumber: "23",
        tla: "ALB",
        broadcastName: "A ALBON",
        fullName: "Alexander ALBON",
        firstName: "Alexander",
        lastName: "Albon",
        teamName: "Williams",
        teamColor: "1868DB",
    },

    "27": {
        racingNumber: "27",
        tla: "HUL",
        broadcastName: "N HULKENBERG",
        fullName: "Nico HULKENBERG",
        firstName: "Nico",
        lastName: "Hulkenberg",
        teamName: "Audi",
        teamColor: "F50537",
    },

    "30": {
        racingNumber: "30",
        tla: "LAW",
        broadcastName: "L LAWSON",
        fullName: "Liam LAWSON",
        firstName: "Liam",
        lastName: "Lawson",
        teamName: "Racing Bulls",
        teamColor: "6C98FF",
    },

    "31": {
        racingNumber: "31",
        tla: "OCO",
        broadcastName: "E OCON",
        fullName: "Esteban OCON",
        firstName: "Esteban",
        lastName: "Ocon",
        teamName: "Haas F1 Teams",
        teamColor: "9C9FA2",
    },

    "41": {
        racingNumber: "41",
        tla: "LIN",
        broadcastName: "A LINDBLAD",
        fullName: "Arvid LINDBLAD",
        firstName: "Arvid",
        lastName: "Lindblad",
        teamName: "Racing Bulls",
        teamColor: "6C98FF",
    },

    "43": {
        racingNumber: "43",
        tla: "COL",
        broadcastName: "F COLAPINTO",
        fullName: "Franco COLAPINTO",
        firstName: "Franco",
        lastName: "Colapinto",
        teamName: "Alpine",
        teamColor: "00A1E8",
    },

    "44": {
        racingNumber: "44",
        tla: "HAM",
        broadcastName: "L HAMILTON",
        fullName: "Lewis HAMILTON",
        firstName: "Lewis",
        lastName: "Hamilton",
        teamName: "Ferrari",
        teamColor: "ED1131",
    },

    "55": {
        racingNumber: "55",
        tla: "SAI",
        broadcastName: "C SAINZ",
        fullName: "Carlos SAINZ",
        firstName: "Carlos",
        lastName: "Sainz",
        teamName: "Williams",
        teamColor: "1868DB",
    },

    "63": {
        racingNumber: "63",
        tla: "RUS",
        broadcastName: "G RUSSELL",
        fullName: "George RUSSELL",
        firstName: "George",
        lastName: "Russell",
        teamName: "Mercedes",
        teamColor: "00D7B6",
    },

    "77": {
        racingNumber: "77",
        tla: "BOT",
        broadcastName: "V BOTTAS",
        fullName: "Valtteri BOTTAS",
        firstName: "Valtteri",
        lastName: "Bottas",
        teamName: "Cadillac",
        teamColor: "909090",
    },

    "81": {
        racingNumber: "81",
        tla: "PIA",
        broadcastName: "O PIASTRI",
        fullName: "Oscar PIASTRI",
        firstName: "Oscar",
        lastName: "Piastri",
        teamName: "McLaren",
        teamColor: "F47600",
    },

    "87": {
        racingNumber: "87",
        tla: "BEA",
        broadcastName: "O BEARMAN",
        fullName: "Oliver BEARMAN",
        firstName: "Oliver",
        lastName: "Bearman",
        teamName: "Haas F1 Team",
        teamColor: "9C9FA2",
    },
};