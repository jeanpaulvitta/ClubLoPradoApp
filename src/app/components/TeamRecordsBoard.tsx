import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, Waves, Users, Edit2, Save, X, Filter, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRecords } from "../hooks/useAppData";
import { saveRecords } from "../services/api";

interface TeamRecordsBoardProps {
  swimmers?: any[];
}

type PoolType = "corta" | "larga";
type AgeCategory = "11-12" | "13-14" | "15-17" | "absoluto";
type Gender = "masculino" | "femenino";

interface NationalRecord {
  event: string;
  time: string;
  holder: string;
  date: string;
  location: string;
}

export function TeamRecordsBoard({ swimmers }: TeamRecordsBoardProps) {
  const [selectedPool, setSelectedPool] = useState<PoolType>("corta");
  const [selectedCategory, setSelectedCategory] = useState<AgeCategory>("11-12");
  const [selectedGender, setSelectedGender] = useState<Gender>("femenino");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<NationalRecord | null>(null);

  // Resetear filtro de prueba y edición cuando cambian los criterios
  const handlePoolChange = (pool: PoolType) => {
    setSelectedPool(pool);
    setSelectedEvent("all");
    setEditingRecord(null);
    setEditForm(null);
  };

  const handleCategoryChange = (category: AgeCategory) => {
    setSelectedCategory(category);
    setSelectedEvent("all");
    setEditingRecord(null);
    setEditForm(null);
  };

  const handleGenderChange = (gender: Gender) => {
    setSelectedGender(gender);
    setSelectedEvent("all");
    setEditingRecord(null);
    setEditForm(null);
  };

  // Estructura de datos para récords nacionales (valores por defecto)
  const defaultData: Record<PoolType, Record<AgeCategory, Record<Gender, Record<string, NationalRecord>>>> = {
    corta: {
      "11-12": {
        femenino: {
          "50m Libre": {
            event: "50m Libre",
            time: "27.96",
            holder: "VALENTINA PEREZ TARRIO",
            date: "2024-09-07",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "31.27",
            holder: "ISIDORA PIZARRO BRITO",
            date: "2017-10-15",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "35.10",
            holder: "Karime Shertzer Manzur",
            date: "2025-06-14",
            location: "Torneo Vel. Estadio Español, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "30.31",
            holder: "Rafaela Acevedo Fuentes",
            date: "2019-09-13",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "01:01.30",
            holder: "VALENTINA PEREZ TARRIO",
            date: "2004-08-10",
            location: "Santiago, Chile"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:06.72",
            holder: "ESTEFANIA URZUA",
            date: "2012-11-21",
            location: "Talca, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:16.40",
            holder: "Karime Shertzer Manzur",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "01:04.91",
            holder: "Isidora Loyola Gunther",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:11.11",
            holder: "STEFANIA PAVLOV",
            date: "1998-11-06",
            location: "Santiago, Chile"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:28.35",
            holder: "ISIDORA PIZARRO BRITO",
            date: "2017-10-13",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:43.70",
            holder: "KEY MATSUBARA",
            date: "2015-12-05",
            location: "Antofagasta, Chile"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:29.47",
            holder: "ROBERTA ROBLES",
            date: "2015-11-20",
            location: "La Pampa, Argentina"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:35.08",
            holder: "STEFANIA PAVLOV",
            date: "1998-11-03",
            location: "Santiago, Chile"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "09:33.08",
            holder: "ROBERTA ROBLES",
            date: "2015-11-21",
            location: "La Pampa, Argentina"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "18:18.83",
            holder: "ROBERTA ROBLES",
            date: "2015-08-15",
            location: "Talca, Chile"
          },
          "100m Combinado": {
            event: "100m Combinado",
            time: "01:10.38",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2024-09-07",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:25.92",
            holder: "Isidora Loyola Gunther",
            date: "2015-09-09",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "05:26.07",
            holder: "ROBERTA ROBLES",
            date: "2015-08-16",
            location: "Talca, Chile"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "02:00.41",
            holder: "Chiara Sciaraffia-Amanda Rodriguez",
            date: "2022-11-27",
            location: "Punta Arenas"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "02:15.95",
            holder: "Francisca Soto-Esperanza Obando",
            date: "2022-11-26",
            location: "Punta Arenas"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "04:21.27",
            holder: "GRINSPUN, REBOLLEDO (UC)",
            date: "1997-11-09",
            location: "Santiago, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:50.70",
            holder: "GRINSPUN, CASANEGRA (UC)",
            date: "1997-11-05",
            location: "Santiago, Chile"
          }
        },
        masculino: {
          "50m Libre": {
            event: "50m Libre",
            time: "25.45",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-09-09",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "27.70",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-09-09",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "31.35",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-09-10",
            location: "Santiago, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "27.24",
            holder: "Javier Vasquez Gonzalez",
            date: "2009-12-04",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "55.74",
            holder: "MAXIMILIANO SCHNETTLER",
            date: "1999-11-03",
            location: "Santiago, Chile"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:02.82",
            holder: "MAURICIO CORTEZ",
            date: "2022-11-27",
            location: "Punta Arenas, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:10.27",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-06-17",
            location: "Temuco, Chile"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "59.94",
            holder: "JAVIER VASQUEZ",
            date: "2009-10-07",
            location: "Punta Arenas, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:01.53",
            holder: "EDUARDO Cisternas Gomez",
            date: "2017-12-07",
            location: "Santiago, Chile"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:15.77",
            holder: "MAURICIO CORTEZ",
            date: "2022-11-26",
            location: "Punta Arenas, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:38.43",
            holder: "FELIPE DEL VALLE",
            date: "2000-11-01",
            location: "Santiago, Chile"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:19.09",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-08-19",
            location: "Talca, Chile"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:18.60",
            holder: "EDUARDO Cisternas Gomez",
            date: "2017-12-09",
            location: "Santiago, Chile"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "09:07.11",
            holder: "EDUARDO Cisternas Gomez",
            date: "2017-10-15",
            location: "Santiago, Chile"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "17:27.46",
            holder: "ROBERTO PEÑAILILLO",
            date: "1999-11-07",
            location: "Santiago, Chile"
          },
          "100m Combinado": {
            event: "100m Combinado",
            time: "01:00.83",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-09-09",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:20.83",
            holder: "MAURICIO CORTEZ",
            date: "2022-11-25",
            location: "Punta Arenas, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:55.17",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-08-19",
            location: "Talca, Chile"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "01:49.01",
            holder: "M.Cortez-Alonso Miranda",
            date: "2022-11-27",
            location: "Punta Arenas, Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "02:05.05",
            holder: "OLIVARES, PREUSS (Mako's)",
            date: "2018-11-18",
            location: "Talca, Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "04:07.11",
            holder: "TAPIA, NORAMBUENA (E Mayor)",
            date: "2018-11-17",
            location: "Talca, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:33.07",
            holder: "MINA,DEL VALLE (SI)",
            date: "2000-11-11",
            location: "Santiago, Chile"
          }
        }
      },
      "13-14": {
        femenino: {
          "50m Libre": {
            event: "50m Libre",
            time: "27.07",
            holder: "Ines Natalia Marin Alexandre",
            date: "2016-09-10",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "30.10",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2018-09-06",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "34.15",
            holder: "Laura Fingerhuth von Frey",
            date: "2024-09-08",
            location: "Santiago, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "29.00",
            holder: "Ines Natalia Marin Alexandre",
            date: "2016-04-23",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "57.90",
            holder: "Ines Natalia Marin Alexandre",
            date: "2016-09-09",
            location: "Santiago, Chile"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:03.59",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2018-09-08",
            location: "Santiago, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:13.90",
            holder: "Antonia Belen Cubillos Vargas",
            date: "2018-09-01",
            location: "Santiago, Chile"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "01:02.99",
            holder: "Ines Natalia Marin Alexandre",
            date: "2016-09-10",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:03.93",
            holder: "Ines Natalia Marin Alexandre",
            date: "2016-09-11",
            location: "Santiago, Chile"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:16.71",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2018-09-09",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:37.50",
            holder: "Antonia Belen Cubillos Vargas",
            date: "2018-08-03",
            location: "Santiago, Chile"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:20.33",
            holder: "DANIELA CRISTINA REYES HINRICHSEN",
            date: "2005-06-30",
            location: "Santiago, Chile"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:24.40",
            holder: "Ines Natalia Marin Alexandre",
            date: "2015-09-04",
            location: "Santiago, Chile"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "09:08.28",
            holder: "STEFANIA PAVLOV",
            date: "1999-10-02",
            location: "Santiago, Chile"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "18:23.36",
            holder: "ARANTZA SALAZAR",
            date: "2014-05-11",
            location: "Santiago, Chile"
          },
          "100m Combinado": {
            event: "100m Combinado",
            time: "01:07.16",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2018-09-07",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:24.53",
            holder: "STEFANIA PAVLOV",
            date: "2000-07-30",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "05:07.77",
            holder: "STEFANIA PAVLOV",
            date: "2000-07-29",
            location: "Santiago, Chile"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "01:57.75",
            holder: "TOLEDO, VON BORRIES (SI)",
            date: "2004-07-02",
            location: "Santiago, Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "02:09.89",
            holder: "TOLEDO, BOZZO (SI)",
            date: "2005-06-26",
            location: "Santiago, Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "04:12.74",
            holder: "FERREIRA, ZECHETTO (CHI)",
            date: "2012-09-02",
            location: "Talca, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:42.41",
            holder: "ZECHETTO, PINTO (CHI)",
            date: "2012-09-01",
            location: "Talca, Chile"
          }
        },
        masculino: {
          "50m Libre": {
            event: "50m Libre",
            time: "24.11",
            holder: "Niklas Engell",
            date: "2024-09-07",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "26.67",
            holder: "Aquiles Bello Ormeño",
            date: "2023-12-17",
            location: "Irlanda"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "29.62",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-11-25",
            location: "San Luis, Argentina"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "25.47",
            holder: "Niklas Engell",
            date: "2024-09-07",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "52.21",
            holder: "Mariano Lazzerini Angeli",
            date: "2018-11-25",
            location: "Santiago, Chile"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "56.12",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2022-09-10",
            location: "Santiago, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:04.52",
            holder: "Maximiliano Cereceda Herrera",
            date: "2019-05-12",
            location: "Santiago, Chile"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "56.18",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2022-09-11",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "01:51.62",
            holder: "EDUARDO Cisternas Gomez",
            date: "2019-08-31",
            location: "Santiago, Chile"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:00.95",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2022-08-27",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:15.83",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-11-25",
            location: "San Luis, Argentina"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:09.04",
            holder: "MAXIMILIANO SCHNETTLER",
            date: "2001-07-04",
            location: "Estadio Español"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "03:56.26",
            holder: "EDUARDO Cisternas Gomez",
            date: "2019-11-30",
            location: "Santiago, Chile"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:18.41",
            holder: "EDUARDO Cisternas Gomez",
            date: "2019-09-01",
            location: "Santiago, Chile"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "15:46.13",
            holder: "EDUARDO Cisternas Gomez",
            date: "2019-11-29",
            location: "Santiago, Chile"
          },
          "100m Combinado": {
            event: "100m Combinado",
            time: "58.08",
            holder: "Manuel Osorio Morán",
            date: "2018-09-07",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:06.79",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-11-24",
            location: "San Luis, Argentina"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:35.20",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-11-27",
            location: "San Luis, Argentina"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "01:40.29",
            holder: "AZOCAR, LAZZERINI (E Mayor)",
            date: "2014-09-07",
            location: "Santiago, Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "01:51.11",
            holder: "AZOCAR, LAZZERINI (E Mayor)",
            date: "2014-09-06",
            location: "Santiago, Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:41.18",
            holder: "JARA, LAZZERINI (CHI)",
            date: "2017-08-17",
            location: "Santa Cruz, Bolivia"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:00.86",
            holder: "CEA, ALVAREZ (CHI)",
            date: "2015-11-21",
            location: "La Pampa, Argentina"
          }
        }
      },
      "15-17": {
        femenino: {
          "50m Libre": {
            event: "50m Libre",
            time: "26.59",
            holder: "Ines Natalia Marin Alexandre",
            date: "2018-08-31",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "29.88",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2019-09-12",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "33.00",
            holder: "Laura Fingerhuth von Frey",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "28.26",
            holder: "Ines Natalia Marin Alexandre",
            date: "2019-09-13",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "57.08",
            holder: "Ines Natalia Marin Alexandre",
            date: "2018-12-12",
            location: "Hangzhou, China"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:03.06",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2019-09-14",
            location: "Santiago, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:11.85",
            holder: "Laura Fingerhuth von Frey",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "01:02.76",
            holder: "Ines Natalia Marin Alexandre",
            date: "2019-05-11",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:01.16",
            holder: "Ines Natalia Marin Alexandre",
            date: "2018-12-11",
            location: "Hangzhou, China"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:15.10",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2019-06-15",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:37.25",
            holder: "ISABEL RIQUELME",
            date: "2012-12-16",
            location: "Estambul, Turquia"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:18.68",
            holder: "Ines Natalia Marin Alexandre",
            date: "2018-09-06",
            location: "Santiago, Chile"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:19.28",
            holder: "Kristel Kobrich Schimpl",
            date: "2003-06-23",
            location: "Argentina"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:51.80",
            holder: "Kristel Kobrich Schimpl",
            date: "2003-07-01",
            location: "Santiago, Chile"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "16:47.52",
            holder: "Kristel Kobrich Schimpl",
            date: "2003-07-05",
            location: "Santiago, Chile"
          },
          "100m Combinado": {
            event: "100m Combinado",
            time: "01:06.18",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2019-05-10",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:23.62",
            holder: "Fernanda Pérez Maureira",
            date: "2025-11-11",
            location: "Talca, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "05:02.27",
            holder: "Ines Natalia Marin Alexandre",
            date: "2017-10-14",
            location: "Santiago, Chile"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "01:57.72",
            holder: "ARAYA, CONTRERAS (VIÑA)",
            date: "2017-05-21",
            location: "Santiago, Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "02:09.17",
            holder: "PINOTTI, VALLANA (VIÑA)",
            date: "2017-05-20",
            location: "Santiago, Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "04:07.66",
            holder: "CORDOVA, FORD (CHI)",
            date: "2012-09-02",
            location: "Talca, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:30.50",
            holder: "SPUHR, RIQUELME (CHI)",
            date: "2012-09-01",
            location: "Talca, Chile"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "09:03.30",
            holder: "CARDENAS, GRINSPUN (UC)",
            date: "2001-07-04",
            location: "Santiago, Chile"
          }
        },
        masculino: {
          "50m Libre": {
            event: "50m Libre",
            time: "22.41",
            holder: "Mariano Lazzerini Angeli",
            date: "2021-09-04",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "25.57",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "27.35",
            holder: "Mariano Lazzerini Angeli",
            date: "2021-09-05",
            location: "Santiago, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "24.59",
            holder: "BENJAMIN Schanpp Contreras",
            date: "2019-09-13",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "49.21",
            holder: "Mariano Lazzerini Angeli",
            date: "2021-09-05",
            location: "Santiago, Chile"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "54.21",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2025-09-06",
            location: "Santiago, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "59.22",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2024-12-11",
            location: "Budapest, Hungria"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "53.86",
            holder: "BENJAMIN Schanpp Contreras",
            date: "2019-09-15",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "01:50.47",
            holder: "Matias Antonio Pinto Matta",
            date: "2014-12-31",
            location: "Doha, Qatar"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "01:58.24",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2024-09-08",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:07.69",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2024-12-13",
            location: "Budapest, Hungria"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:00.15",
            holder: "BENJAMIN Schanpp Contreras",
            date: "2019-09-12",
            location: "Santiago, Chile"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "03:46.43",
            holder: "EDUARDO Cisternas Gomez",
            date: "2021-12-15",
            location: "Abu Dabhi"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:21.32",
            holder: "ROBERTO PEÑAILILLO",
            date: "2004-07-29",
            location: "Santiago, Chile"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "16:03.25",
            holder: "BENJAMIN GUZMAN",
            date: "2006-11-11",
            location: "Santiago, Chile"
          },
          "100m Combinado": {
            event: "100m Combinado",
            time: "56.60",
            holder: "Manuel Osorio Morán",
            date: "2019-09-12",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:03.40",
            holder: "Manuel Osorio Morán",
            date: "2019-09-14",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:28.27",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2022-08-27",
            location: "Santiago, Chile"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "01:34.97",
            holder: "LAZZERINI, CEA (E Mayor)",
            date: "2017-05-20",
            location: "Santiago, Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "01:43.67",
            holder: "REYES, LAZZERINI (E Mayor)",
            date: "2019-09-13",
            location: "Santiago, Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:31.02",
            holder: "LAZZERINI, OLIVOS (E Mayor)",
            date: "2017-05-19",
            location: "Santiago, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "03:56.35",
            holder: "AZOCAR, LAZZERINI (R Metro)",
            date: "2016-10-05",
            location: "Talca, Chile"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "07:46.89",
            holder: "CASTRO,BENGOECHEA (SI)",
            date: "1999-11-04",
            location: "Santiago, Chile"
          }
        }
      },
      "absoluto": {
        femenino: {
          "50m Libre": {
            event: "50m Libre",
            time: "26.06",
            holder: "Ines Natalia Marin Alexandre",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "29.16",
            holder: "SARAH SZKLARUK TRAIPE",
            date: "2021-12-19",
            location: "Abu Dhabi"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "32.62",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "27.28",
            holder: "Ines Natalia Marin Alexandre",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "55.28",
            holder: "Ines Natalia Marin Alexandre",
            date: "2022-12-13",
            location: "Melbourne"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:01.36",
            holder: "SARAH SZKLARUK TRAIPE",
            date: "2021-12-15",
            location: "Abu Dhabi"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:11.30",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "01:00.84",
            holder: "Ines Natalia Marin Alexandre",
            date: "2025-09-05",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "01:58.79",
            holder: "Ines Natalia Marin Alexandre",
            date: "2022-12-18",
            location: "Melbourne"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:15.10",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2019-09-15",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:34.02",
            holder: "Antonia Belen Cubillos Vargas",
            date: "2022-09-10",
            location: "Santiago, Chile"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:18.68",
            holder: "Ines Natalia Marin Alexandre",
            date: "2018-09-06",
            location: "Santiago, Chile"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:04.34",
            holder: "Kristel Kobrich Schimpl",
            date: "2009-11-15",
            location: "Berlín, Alemania"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:08.02",
            holder: "Kristel Kobrich Schimpl",
            date: "2009-11-14",
            location: "Berlín, Alemania"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "15:51.44",
            holder: "Kristel Kobrich Schimpl",
            date: "2012-09-24",
            location: "Rio de Janeiro, Brasil"
          },
          "100m Combinado": {
            event: "100m Combinado",
            time: "01:04.29",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2025-04-05",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:19.76",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2025-07-09",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:45.46",
            holder: "Kristel Kobrich Schimpl",
            date: "2010-09-23",
            location: "Santos, Brasil"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "01:50.25",
            holder: "SPUHR, ENGELL (EE)",
            date: "2019-09-14",
            location: "Santiago, Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "02:01.74",
            holder: "SPUHR, BENNEWITZ (EE)",
            date: "2017-09-08",
            location: "Santiago, Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:59.03",
            holder: "ARDILES, REYES, REYES, SZKLARU",
            date: "2025-09-07",
            location: "Santiago, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:22.72",
            holder: "ARDILES, REYES, REYES, SZKLARU",
            date: "2025-09-06",
            location: "Santiago, Chile"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "09:03.30",
            holder: "CARDENAS, GRINSPUN (UC)",
            date: "2001-07-04",
            location: "Santiago, Chile"
          }
        },
        masculino: {
          "50m Libre": {
            event: "50m Libre",
            time: "22.25",
            holder: "OLIVER ELLIOT",
            date: "2014-05-11",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "25.47",
            holder: "OLIVER ELLIOT",
            date: "2016-10-08",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "27.35",
            holder: "Mariano Lazzerini Angeli",
            date: "2021-12-20",
            location: "Abu Dhabi"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "24.06",
            holder: "OLIVER ELLIOT / MARIANO LAZZERINI",
            date: "2018-12-14",
            location: "Hangzhou, China"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "49.21",
            holder: "Mariano Lazzerini Angeli",
            date: "2021-09-05",
            location: "Santiago, Chile"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "54.21",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2025-09-06",
            location: "Santiago, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "59.22",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2024-12-11",
            location: "Budapest, Hungria"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "53.31",
            holder: "BENJAMIN Schanpp Contreras",
            date: "2024-12-13",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "01:48.84",
            holder: "Gabriel Araya Santander",
            date: "2021-10-30",
            location: "Puerto Rico"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "01:58.24",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2024-09-08",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:07.69",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2024-12-13",
            location: "Budapest, Hungria"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "01:58.12",
            holder: "GABRIEL ARAYA",
            date: "2021-10-31",
            location: "Puerto Rico"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "03:46.43",
            holder: "EDUARDO Cisternas Gomez",
            date: "2021-12-15",
            location: "Abu Dhabi"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:06.61",
            holder: "FELIPE TAPIA",
            date: "2015-05-15",
            location: "Santa Fe, Argentina"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "15:23.30",
            holder: "EDUARDO Cisternas Gomez",
            date: "2021-12-15",
            location: "Abu Dhabi"
          },
          "100m Combinado": {
            event: "100m Combinado",
            time: "56.03",
            holder: "Manuel Osorio Morán",
            date: "2022-09-08",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "01:59.88",
            holder: "Mariano Lazzerini Angeli",
            date: "2022-04-23",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:22.52",
            holder: "FELIPE QUIROZ",
            date: "2016-10-08",
            location: "Santiago, Chile"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "01:33.42",
            holder: "OSORIO, TAPIA",
            date: "2018-09-08",
            location: "Santiago, Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "01:43.17",
            holder: "CEA, ALVAREZ (E Mayor)",
            date: "2018-09-07",
            location: "Santiago, Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:30.53",
            holder: "CRUZ, VARAS (EE)",
            date: "2019-11-30",
            location: "Santiago, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "03:50.83",
            holder: "BORELLO, SEPULVEDA (EE)",
            date: "2016-10-09",
            location: "Santiago, Chile"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "07:35.97",
            holder: "PINTO, QUIROZ (CHI)",
            date: "2016-12-09",
            location: "Windsor, Canadá"
          }
        }
      }
    },
    larga: {
      "11-12": {
        femenino: {
          "50m Libre": {
            event: "50m Libre",
            time: "28.63",
            holder: "COURTNEY SCHULTZ",
            date: "2010-07-28",
            location: "California, Estados Unidos"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "31.62",
            holder: "ISIDORA PIZARRO BRITO",
            date: "2017-10-22",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "34.49",
            holder: "Fernanda Guamparito Chaparro",
            date: "2024-12-06",
            location: "Bucaramanga, Colombia"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "31.08",
            holder: "Rafaela Acevedo Fuentes",
            date: "2019-12-13",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "01:01.43",
            holder: "Ines Natalia Marin Alexandre",
            date: "2014-12-07",
            location: "Aracaju, Brasil"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:08.74",
            holder: "Martina Roper Joo",
            date: "2019-12-05",
            location: "Asunción, Paraguay"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:17.16",
            holder: "Fernanda Guamparito Chaparro",
            date: "2024-12-07",
            location: "Bucaramanga, Colombia"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "01:06.81",
            holder: "Isidora Loyola Gunther",
            date: "2025-12-12",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:13.95",
            holder: "Isidora Loyola Gunther",
            date: "2025-12-11",
            location: "Santiago, Chile"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:28.97",
            holder: "Martina Roper Joo",
            date: "2019-12-13",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:48.89",
            holder: "Karime Shertzer Manzur",
            date: "2025-05-24",
            location: "Santiago, Chile"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:35.21",
            holder: "Ines Natalia Marin Alexandre",
            date: "2014-11-21",
            location: "Santiago, Chile"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:42.80",
            holder: "CAROLINA ENDLER",
            date: "2000-10-28",
            location: "Lima, Perú"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "09:56.53",
            holder: "Monserrat Spielmann Miguel",
            date: "2019-07-18",
            location: "Southesteastern, USA"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:31.05",
            holder: "Isidora Loyola Gunther",
            date: "2025-12-10",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "05:22.68",
            holder: "KEY MATSUBARA",
            date: "2015-11-05",
            location: "Santiago, Chile"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "02:02.93",
            holder: "A.Tapia, M Abarca, I. Ligueno, F. Mogollon",
            date: "2024-06-23",
            location: "Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "02:17.19",
            holder: "B. Hernandez, C. Salas, R Falconne, A. ansaldo",
            date: "2025-01-18",
            location: "Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "04:22.56",
            holder: "ZAMORANO, VON BORRIES (CHI)",
            date: "2001-12-10",
            location: "Santiago, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:45.82",
            holder: "ARDILES, REYES, CASTRO, ORELLANA",
            date: "2016-12-02",
            location: "Santiago, Chile"
          }
        },
        masculino: {
          "50m Libre": {
            event: "50m Libre",
            time: "26.10",
            holder: "Cristian Linder",
            date: "2008-12-05",
            location: "Maldonado, Uruguay"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "28.98",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-10-22",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "31.08",
            holder: "Maximiliano Cereceda Herrera",
            date: "2018-09-29",
            location: "Santiago, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "27.73",
            holder: "Javier Vasquez",
            date: "2009-12-17",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "56.22",
            holder: "Maximiliano Schnettler",
            date: "1999-10-29",
            location: "Sta. Cruz, Bolivia"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:04.34",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-11-10",
            location: "Santiago, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:12.47",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-10-23",
            location: "Santiago, Chile"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "59.53",
            holder: "Javier Vasquez Gonzalez",
            date: "2009-12-20",
            location: "Santiago, Chile"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:02.56",
            holder: "EDUARDO Cisternas Gomez",
            date: "2017-12-19",
            location: "Santiago, Chile"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:24.63",
            holder: "Martin Baffico",
            date: "2013-12-08",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:40.62",
            holder: "NICOLÁS FLORES JOFRÉ",
            date: "2024-12-14",
            location: "Santiago, Chile"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:21.48",
            holder: "Javier Vasquez Gonzalez",
            date: "2009-12-18",
            location: "Santiago, Chile"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:21.72",
            holder: "EDUARDO Cisternas Gomez",
            date: "2017-12-20",
            location: "Santiago, Chile"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "09:10.95",
            holder: "Alvaro Trewhela",
            date: "2003-10-30",
            location: "Santiago, Chile"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "17:31.86",
            holder: "EDUARDO Cisternas Gomez",
            date: "2017-12-21",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:20.66",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-11-12",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "05:01.21",
            holder: "Maximiliano Cereceda Herrera",
            date: "2017-11-18",
            location: "Santiago, Chile"
          },
          "4x50m Libre": {
            event: "4x50m Libre",
            time: "01:53.58",
            holder: "Adaos, Muñoz, Delgado, Orrego",
            date: "2024-10-20",
            location: "Chile"
          },
          "4x50m Combinado": {
            event: "4x50m Combinado",
            time: "02:13.40",
            holder: "Leyton, Flores, espinoza, Guastaferro",
            date: "2024-10-19",
            location: "Chile"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "04:01.20",
            holder: "Mendez, Geshe, Estevezm, Lazzerini",
            date: "2012-12-03",
            location: "Santiago, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:30.40",
            holder: "Cereceda, Osorio, Maureira, Marin",
            date: "2012-12-03",
            location: "Santiago, Chile"
          }
        }
      },
      "13-14": {
        femenino: {
          "50m Libre": {
            event: "50m Libre",
            time: "27.06",
            holder: "VALENTINA PEREZ TARRIO",
            date: "2026-01-29",
            location: "Estadio Nacional - Santiago"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "31.10",
            holder: "Martina Roper Joo",
            date: "2022-04-28",
            location: "Rosario, Argentina"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "34.30",
            holder: "Maira Olivari Meli",
            date: "2025-07-04",
            location: "Campeonato Nac Invierno 2025, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "28.52",
            holder: "VALENTINA PEREZ TARRIO",
            date: "2026-01-28",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "59.66",
            holder: "Ines Natalia Marin Alexandre",
            date: "2016-07-01",
            location: "Santiago, Chile"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:04.57",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2018-11-07",
            location: "Trujillo, Perú"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:14.40",
            holder: "JOAQUINA NEGRETE VALDIVIA",
            date: "2026-01-27",
            location: "Santiago, Chile"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "01:04.73",
            holder: "ESTEFANIA URZUA",
            date: "2014-12-12",
            location: "Cordoba, Argentina"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:08.16",
            holder: "Ines Natalia Marin Alexandre",
            date: "2016-11-13",
            location: "Joao Pessoa, Brasil"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:21.39",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2018-11-08",
            location: "Trujillo, Perú"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:40.93",
            holder: "AVALON SCHULTZ",
            date: "2014-03-09",
            location: "Santiago, Chile"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:21.11",
            holder: "ESTEFANIA URZUA",
            date: "2014-12-20",
            location: "Santiago, Chile"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:31.97",
            holder: "STEFANIA PAVLOV",
            date: "2000-10-26",
            location: "Lima, Perú"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "09:25.53",
            holder: "Ines Natalia Marin Alexandre",
            date: "2016-12-16",
            location: "Santiago, Chile"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "18:16.08",
            holder: "Catalina Bustamante Aburto",
            date: "2016-12-18",
            location: "Santiago, Chile"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:25.23",
            holder: "AVALON SCHULTZ",
            date: "2013-07-31",
            location: "California, Estados Unidos"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "05:09.93",
            holder: "AVALON SCHULTZ",
            date: "2013-07-31",
            location: "California, Estados Unidos"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "04:07.26",
            holder: "REYES, KLENNER (CHI)",
            date: "2018-09-18",
            location: "Guayaquil, Ecuador"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:35.86",
            holder: "ROBLES, MATSUBARA (CHI)",
            date: "2016-09-30",
            location: "Santiago, Chile"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "09:15.60",
            holder: "E.VICENCIO-FCA SOTO",
            date: "2023-09-19",
            location: "B.Aires, Argentina"
          }
        },
        masculino: {
          "50m Libre": {
            event: "50m Libre",
            time: "24.73",
            holder: "Mariano Lazzerini Angeli",
            date: "2018-09-20",
            location: "Guayaquil, Ecuador"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "27.83",
            holder: "Manuel Osorio Morán",
            date: "2018-11-10",
            location: "Trujillo, Perú"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "29.91",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-12-15",
            location: "Santiago, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "26.30",
            holder: "Gabriel Araya Santander",
            date: "2014-12-18",
            location: "Santiago, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "53.60",
            holder: "Mariano Lazzerini Angeli",
            date: "2018-09-21",
            location: "Guayaquil, Ecuador"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "58.78",
            holder: "Maximiliano Cereceda Herrera",
            date: "2019-12-13",
            location: "Santiago, Chile"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:06.39",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-11-09",
            location: "Lima, Perú"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "57.08",
            holder: "Felipe Baffico",
            date: "2020-07-20",
            location: "USA"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "01:54.71",
            holder: "EDUARDO Cisternas Gomez",
            date: "2019-08-21",
            location: "Budapest, Hungria"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:10.29",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2022-07-06",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:21.57",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-11-13",
            location: "Lima, Perú"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:05.98",
            holder: "Felipe Baffico",
            date: "2020-07-26",
            location: "USA"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:00.43",
            holder: "EDUARDO Cisternas Gomez",
            date: "2019-12-13",
            location: "Santiago, Chile"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:22.28",
            holder: "EDUARDO Cisternas Gomez",
            date: "2019-08-22",
            location: "Budapest, Hungria"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "15:56.22",
            holder: "EDUARDO Cisternas Gomez",
            date: "2019-06-14",
            location: "Lima, Peru"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:10.70",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-12-16",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:43.92",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2021-11-12",
            location: "Lima, Perú"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:37.71",
            holder: "Lazzerini, Madariaga, Marchesani, Osorio",
            date: "2018-09-19",
            location: "Guayaquil, Ecuador"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:05.14",
            holder: "Osorio, Lazzerini, Cereceda, Marchisini",
            date: "2018-09-20",
            location: "Guayaquil, Ecuador"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "08:23.61",
            holder: "Morano, Quaas, Cortez, Fuentes",
            date: "2018-09-19",
            location: "Guayaquil, Ecuador"
          }
        }
      },
      "15-17": {
        femenino: {
          "50m Libre": {
            event: "50m Libre",
            time: "26.90",
            holder: "Ines Natalia Marin Alexandre",
            date: "2019-08-09",
            location: "Lima, Perú"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "30.43",
            holder: "Martina Roper Joo",
            date: "2023-07-07",
            location: "Antofagasta, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "33.40",
            holder: "Laura Fingerhuth von Frey",
            date: "2025-09-27",
            location: "Santiago, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "28.17",
            holder: "Monserrat Spielmann Miguel",
            date: "2023-06-22",
            location: "San Antonio, Texas"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "57.89",
            holder: "Ines Natalia Marin Alexandre",
            date: "2019-08-08",
            location: "Lima, Perú"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:03.79",
            holder: "SARAH SZKLARUK TRAIPE",
            date: "2019-08-02",
            location: "Misisipi, Estados Unidos"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:13.30",
            holder: "ISABEL RIQUELME",
            date: "2011-08-18",
            location: "Lima, Perú"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "01:01.23",
            holder: "Monserrat Spielmann Miguel",
            date: "2024-05-17",
            location: "Atlanta, USA"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:04.81",
            holder: "Monserrat Spielmann Miguel",
            date: "2024-05-17",
            location: "Atlanta, USA"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:18.77",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2019-12-13",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:38.55",
            holder: "Antonia Belen Cubillos Vargas",
            date: "2021-03-17",
            location: "Buenos Aires, Argentina"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:17.28",
            holder: "ESTEFANIA URZUA",
            date: "2015-04-17",
            location: "Lima, Perú"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:18.24",
            holder: "Kristel Kobrich Schimpl",
            date: "2003-08-13",
            location: "Santo Domingo, RD"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:43.90",
            holder: "Kristel Kobrich Schimpl",
            date: "2003-08-16",
            location: "Santo Domingo, RD"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "17:08.06",
            holder: "Kristel Kobrich Schimpl",
            date: "2003-12-22",
            location: "Río de Janeiro, Brasil"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:24.68",
            holder: "Monserrat Spielmann Miguel",
            date: "2024-05-18",
            location: "Atlanta, USA"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "05:05.53",
            holder: "AVALON SCHULTZ",
            date: "2015-07-29",
            location: "California, Estados Unidos"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:56.37",
            holder: "SZKLARUK, REYES (CHI)",
            date: "2019-04-09",
            location: "Santiago, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:26.30",
            holder: "SZKLARUK, CUBILLOS (CHI)",
            date: "2019-04-13",
            location: "Santiago, Chile"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "08:37.96",
            holder: "MARIN, BUSTAMANTE (CHI)",
            date: "2019-04-12",
            location: "Santiago, Chile"
          }
        },
        masculino: {
          "50m Libre": {
            event: "50m Libre",
            time: "22.79",
            holder: "Mariano Lazzerini Angeli",
            date: "2021-11-11",
            location: "Lima, Peru"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "26.41",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2025-12-10",
            location: "Santiago, Chile"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "28.16",
            holder: "Mariano Lazzerini Angeli",
            date: "2021-11-12",
            location: "Lima, Perú"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "24.43",
            holder: "Felipe Baffico",
            date: "2022-09-03",
            location: "Lima, Perú"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "51.45",
            holder: "Mariano Lazzerini Angeli",
            date: "2020-12-19",
            location: "Asunción, Paraguay"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "56.59",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2025-07-27",
            location: "Singapur"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:01.89",
            holder: "Mariano Lazzerini Angeli",
            date: "2021-11-09",
            location: "Lima, Perú"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "54.47",
            holder: "Elías Ardiles Quiroz",
            date: "2023-09-20",
            location: "Buenos Aires, Argentina"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "01:50.63",
            holder: "EDUARDO Cisternas Gomez",
            date: "2021-11-09",
            location: "Lima, Peru"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:00.85",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2025-08-11",
            location: "Asunción, Paraguay"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:14.24",
            holder: "VICENTE VILLANUEVA LOYOLA",
            date: "2024-06-12",
            location: "Asunción, Paraguay"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:00.70",
            holder: "Felipe Baffico",
            date: "2022-07-02",
            location: "Futures NC, USA"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "03:54.10",
            holder: "EDUARDO Cisternas Gomez",
            date: "2021-07-24",
            location: "Tokio, Japon"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:12.33",
            holder: "EDUARDO Cisternas Gomez",
            date: "2021-05-20",
            location: "San Juan, Puerto Rico"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "15:42.25",
            holder: "EDUARDO Cisternas Gomez",
            date: "2021-03-18",
            location: "Buenos Aires, Argentina"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:05.62",
            holder: "Manuel Osorio Morán",
            date: "2021-11-09",
            location: "Lima, Perú"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:29.98",
            holder: "Felipe Baffico",
            date: "2023-02-10",
            location: "USA"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:28.94",
            holder: "Cisternas, Madariaga, Baffico, Lazzerini",
            date: "2021-11-09",
            location: "Lima, Perú"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "03:49.84",
            holder: "Vargas, Villanueva, Ardiles, Cofre",
            date: "2023-09-20",
            location: "Buenos Aires, Argentina"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "07:41.13",
            holder: "Cisternas, Baffico, Madariaga, Lazzerini",
            date: "2021-11-12",
            location: "Lima, Perú"
          }
        }
      },
      "absoluto": {
        femenino: {
          "50m Libre": {
            event: "50m Libre",
            time: "26.46",
            holder: "Ines Natalia Marin Alexandre",
            date: "2021-11-28",
            location: "Cali, Colombia"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "30.19",
            holder: "SARAH SZKLARUK TRAIPE",
            date: "2021-03-16",
            location: "Buenos Aires, Argentina"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "33.30",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2025-05-22",
            location: "Camp. Nac. OPEN Apertura, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "27.92",
            holder: "Ines Natalia Marin Alexandre",
            date: "2022-07-02",
            location: "Campeonato Nac. Invierno, Chile"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "56.72",
            holder: "Ines Natalia Marin Alexandre",
            date: "2025-07-04",
            location: "Campeonato Nac. Invierno, Chile"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "01:03.26",
            holder: "SARAH SZKLARUK TRAIPE",
            date: "2021-03-17",
            location: "Buenos Aires, Argentina"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:13.30",
            holder: "ISABEL RIQUELME",
            date: "2011-08-18",
            location: "Lima, Perú"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "01:01.23",
            holder: "Monserrat Spielmann Miguel",
            date: "2024-05-17",
            location: "Atlanta, USA"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "02:01.89",
            holder: "Ines Natalia Marin Alexandre",
            date: "2023-04-13",
            location: "Westmond, USA"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:18.77",
            holder: "TRINIDAD ARDILES QUIROZ",
            date: "2019-12-13",
            location: "Santiago, Chile"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:38.10",
            holder: "Antonia Belen Cubillos Vargas",
            date: "2023-10-24",
            location: "Santiago, Chile"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:17.28",
            holder: "ESTEFANIA URZUA",
            date: "2015-04-17",
            location: "Lima, Perú"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "04:11.32",
            holder: "Kristel Kobrich Schimpl",
            date: "2012-03-29",
            location: "Indianapolis, USA"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:26.75",
            holder: "Kristel Kobrich Schimpl",
            date: "2013-07-30",
            location: "Barcelona, España"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "15:54.30",
            holder: "Kristel Kobrich Schimpl",
            date: "2013-07-30",
            location: "Barcelona, España"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:23.01",
            holder: "FERNANDA ANTONIA REYES HINRICHSEN",
            date: "2025-11-23",
            location: "Santiago, Chile"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:55.14",
            holder: "Kristel Kobrich Schimpl",
            date: "2010-05-04",
            location: "Brasil"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:56.37",
            holder: "SZKLARUK, REYES (CHI)",
            date: "2019-04-09",
            location: "Santiago, Chile"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "04:18.81",
            holder: "SZKLARUK- A. CUBILLOS",
            date: "2023-10-25",
            location: "Santiago, Chile"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "08:26.66",
            holder: "MARIN, SPIELMANN (CHI)",
            date: "2023-10-24",
            location: "Santiago, Chile"
          }
        },
        masculino: {
          "50m Libre": {
            event: "50m Libre",
            time: "22.72",
            holder: "LUIS TOLEDO MONTUORI",
            date: "2025-12-13",
            location: "Santiago, Chile"
          },
          "50m Espalda": {
            event: "50m Espalda",
            time: "26.11",
            holder: "Elías Ardiles Quiroz",
            date: "2025-07-20",
            location: "FISU World University Games"
          },
          "50m Pecho": {
            event: "50m Pecho",
            time: "27.90",
            holder: "Mariano Lazzerini Angeli",
            date: "2025-07-04",
            location: "Campeonato Nac Invierno 2025, Chile"
          },
          "50m Mariposa": {
            event: "50m Mariposa",
            time: "24.16",
            holder: "BENJAMIN Schanpp Contreras",
            date: "2024-10-01",
            location: "Cali, Colombia"
          },
          "100m Libre": {
            event: "100m Libre",
            time: "50.94",
            holder: "Felipe Baffico",
            date: "2025-07-24",
            location: "TYR Future Ocala, USA"
          },
          "100m Espalda": {
            event: "100m Espalda",
            time: "56.59",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2025-07-27",
            location: "Singapur"
          },
          "100m Pecho": {
            event: "100m Pecho",
            time: "01:01.15",
            holder: "Mariano Lazzerini Angeli",
            date: "2024-08-11",
            location: "Asunción, Paraguay"
          },
          "100m Mariposa": {
            event: "100m Mariposa",
            time: "53.74",
            holder: "Felipe Baffico",
            date: "2024-07-25",
            location: "Tyr Futures Ocaala"
          },
          "200m Libre": {
            event: "200m Libre",
            time: "01:47.99",
            holder: "EDUARDO Cisternas Gomez",
            date: "2025-08-11",
            location: "Asuncion, Paraguay"
          },
          "200m Espalda": {
            event: "200m Espalda",
            time: "02:00.85",
            holder: "Edhy Patricio Vargas Ronquillo",
            date: "2025-08-11",
            location: "Asunción, Paraguay"
          },
          "200m Pecho": {
            event: "200m Pecho",
            time: "02:13.75",
            holder: "Mariano Lazzerini Angeli",
            date: "2024-06-12",
            location: "Asunción, Paraguay"
          },
          "200m Mariposa": {
            event: "200m Mariposa",
            time: "02:00.42",
            holder: "Gabriel Araya Santander",
            date: "2019-12-05",
            location: "Atlanta, USA"
          },
          "400m Libre": {
            event: "400m Libre",
            time: "03:49.40",
            holder: "EDUARDO Cisternas Gomez",
            date: "2025-08-10",
            location: "Asuncion, Paraguay"
          },
          "800m Libre": {
            event: "800m Libre",
            time: "08:08.92",
            holder: "EDUARDO Cisternas Gomez",
            date: "2023-04-12",
            location: "Westmond, USA"
          },
          "1500m Libre": {
            event: "1500m Libre",
            time: "15:42.25",
            holder: "EDUARDO Cisternas Gomez",
            date: "2021-03-18",
            location: "Buenos Aires, Argentina"
          },
          "200m Combinado": {
            event: "200m Combinado",
            time: "02:05.53",
            holder: "Manuel Osorio Morán",
            date: "2022-10-02",
            location: "Asunción, Perú"
          },
          "400m Combinado": {
            event: "400m Combinado",
            time: "04:29.98",
            holder: "Felipe Baffico",
            date: "2023-02-10",
            location: "USA"
          },
          "4x100m Libre": {
            event: "4x100m Libre",
            time: "03:25.45",
            holder: "Lazzerini, cisternas, Schnapp, Osorio",
            date: "2022-07-04",
            location: "Valledupar, Colombia"
          },
          "4x100m Combinado": {
            event: "4x100m Combinado",
            time: "03:43.11",
            holder: "E Vargas, M Lazzerini, B Schnapp, E Cisternas",
            date: "2023-10-25",
            location: "Santiago, Chile"
          },
          "4x200m Libre": {
            event: "4x200m Libre",
            time: "07:32.66",
            holder: "Cisternas, Schnapp, Lazzerini, Araya",
            date: "2021-11-29",
            location: "Cali, Colombia"
          }
        }
      }
    }
  };

  const queryClient = useQueryClient();
  const { data: storedRecords } = useRecords();
  const nationalRecords = (storedRecords ?? defaultData) as typeof defaultData;

  const getPoolTypeLabel = (pool: PoolType) => {
    return pool === "corta" ? "Piscina Corta (25m)" : "Piscina Larga (50m)";
  };

  const getCategoryLabel = (category: AgeCategory) => {
    switch (category) {
      case "11-12":
        return "11-12 años";
      case "13-14":
        return "13-14 años";
      case "15-17":
        return "15-17 años";
      case "absoluto":
        return "Absoluto";
    }
  };

  const getGenderLabel = (gender: Gender) => {
    return gender === "masculino" ? "Masculino" : "Femenino";
  };

  // Obtener lista de eventos únicos
  const getAvailableEvents = () => {
    const records = nationalRecords[selectedPool][selectedCategory][selectedGender];
    return Object.keys(records).sort();
  };

  // Iniciar edición de récord
  const handleEditRecord = (event: string, record: NationalRecord) => {
    setEditingRecord(event);
    setEditForm({ ...record });
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditForm(null);
  };

  // Guardar récord editado
  const handleSaveRecord = async () => {
    if (!editingRecord || !editForm) return;
    const updated = {
      ...nationalRecords,
      [selectedPool]: {
        ...nationalRecords[selectedPool],
        [selectedCategory]: {
          ...nationalRecords[selectedPool][selectedCategory],
          [selectedGender]: {
            ...nationalRecords[selectedPool][selectedCategory][selectedGender],
            [editingRecord]: editForm,
          },
        },
      },
    };
    queryClient.setQueryData(['records'], updated);
    setEditingRecord(null);
    setEditForm(null);
    try {
      await saveRecords(updated);
    } catch (e) {
      console.error('Error guardando récord:', e);
    }
  };

  const generateRecordsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Título principal
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Récords Nacionales - Chile", pageWidth / 2, 18, { align: "center" });

    // Subtítulo con filtros actuales
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${getPoolTypeLabel(selectedPool)} • ${getCategoryLabel(selectedCategory)} • ${getGenderLabel(selectedGender)}`,
      pageWidth / 2,
      27,
      { align: "center" }
    );

    const currentRecords = nationalRecords[selectedPool][selectedCategory][selectedGender];
    let entries = Object.entries(currentRecords);
    if (selectedEvent !== "all") {
      entries = entries.filter(([ev]) => ev === selectedEvent);
    }

    // Tabla principal de récords
    autoTable(doc, {
      head: [["Prueba", "Tiempo", "Atleta", "Fecha", "Lugar"]],
      body: entries.map(([, r]) => [r.event, r.time, r.holder, r.date, r.location]),
      startY: 34,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [234, 179, 8], textColor: 0 },
      alternateRowStyles: { fillColor: [254, 252, 232] },
    });

    // Separar pruebas individuales de relevos
    const individualEntries = entries.map(([, r]) => r).filter((r) => r.date && !r.event.startsWith("4x"));
    const relayEntries = entries.map(([, r]) => r).filter((r) => r.event.startsWith("4x"));

    // Tabla récord más reciente y más antiguo (solo pruebas individuales)
    if (individualEntries.length > 0) {
      const sorted = [...individualEntries].sort((a, b) => a.date.localeCompare(b.date));
      const oldest = sorted[0];
      const newest = sorted[sorted.length - 1];

      const afterMainTable = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Récord más reciente y más antiguo (pruebas individuales)", pageWidth / 2, afterMainTable, { align: "center" });

      autoTable(doc, {
        head: [["", "Prueba", "Tiempo", "Atleta", "Fecha", "Lugar"]],
        body: [
          ["Más reciente", newest.event, newest.time, newest.holder, newest.date, newest.location],
          ["Más antiguo", oldest.event, oldest.time, oldest.holder, oldest.date, oldest.location],
        ],
        startY: afterMainTable + 5,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [99, 102, 241], textColor: 255 },
        bodyStyles: { fillColor: [238, 242, 255] },
        columnStyles: { 0: { fontStyle: "bold" } },
      });
    }

    // Tabla de relevos
    if (relayEntries.length > 0) {
      const afterPrevTable = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Relevos", pageWidth / 2, afterPrevTable, { align: "center" });

      autoTable(doc, {
        head: [["Prueba", "Tiempo", "Atleta", "Fecha", "Lugar"]],
        body: relayEntries.map((r) => [r.event, r.time, r.holder, r.date, r.location]),
        startY: afterPrevTable + 5,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        alternateRowStyles: { fillColor: [236, 253, 245] },
      });
    }

    // Tabla: atleta con más récords
    const holderCount: Record<string, { count: number; events: string[] }> = {};
    for (const [, r] of entries) {
      const name = r.holder.trim();
      if (!holderCount[name]) holderCount[name] = { count: 0, events: [] };
      holderCount[name].count++;
      holderCount[name].events.push(r.event);
    }
    const topHolders = Object.entries(holderCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);

    if (topHolders.length > 0) {
      const afterPrevTable = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Atletas con más récords nacionales", pageWidth / 2, afterPrevTable, { align: "center" });

      autoTable(doc, {
        head: [["Atleta", "N° Récords", "Pruebas"]],
        body: topHolders.map(([name, data]) => [
          name,
          String(data.count),
          data.events.join(", "),
        ]),
        startY: afterPrevTable + 5,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [220, 38, 38], textColor: 255 },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        columnStyles: { 1: { halign: "center", fontStyle: "bold" } },
      });
    }

    // Pie de página
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120);
    doc.text("Récords Nacionales -- Vitta, Jean Paul", pageWidth / 2, pageHeight - 8, { align: "center" });

    const filename = `Records_${selectedPool}_${selectedCategory}_${selectedGender}.pdf`;
    doc.save(filename);
  };

  const renderRecordsTable = () => {
    const records = nationalRecords[selectedPool][selectedCategory][selectedGender];
    let recordEntries = Object.entries(records);

    // Filtrar por evento si se seleccionó uno específico
    if (selectedEvent !== "all") {
      recordEntries = recordEntries.filter(([event]) => event === selectedEvent);
    }

    if (recordEntries.length === 0) {
      return (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="py-12">
            <div className="text-center text-gray-400">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-semibold mb-2">No hay récords registrados</p>
              <p className="text-sm">
                Los récords nacionales para {getGenderLabel(selectedGender)} {getCategoryLabel(selectedCategory)} en {getPoolTypeLabel(selectedPool)} 
                estarán disponibles próximamente.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recordEntries.map(([event, record]) => {
          const isEditing = editingRecord === event;
          
          return (
            <Card key={event} className={`border-2 ${isEditing ? 'border-blue-400 bg-blue-50' : 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-white'} hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span className="font-bold">{event}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500 text-white shrink-0">
                      <Trophy className="w-3 h-3 mr-1" />
                      RN
                    </Badge>
                    {!isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditRecord(event, record)}
                        className="h-7 w-7 p-0 hover:bg-blue-100"
                        title="Editar récord"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing && editForm ? (
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-300 space-y-3">
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Tiempo</Label>
                      <Input
                        type="text"
                        value={editForm.time}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="mt-1 h-9"
                        placeholder="00:00.00"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Atleta</Label>
                      <Input
                        type="text"
                        value={editForm.holder}
                        onChange={(e) => setEditForm({ ...editForm, holder: e.target.value })}
                        className="mt-1 h-9"
                        placeholder="Nombre del atleta"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Fecha</Label>
                      <Input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Lugar</Label>
                      <Input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="mt-1 h-9"
                        placeholder="Ciudad, País"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={handleSaveRecord}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="flex-1"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-red-600">
                        {record.time}
                      </p>
                    </div>
                    <div className="border-t pt-3 space-y-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {record.holder}
                      </p>
                      <p className="text-xs text-gray-600">
                        📅 {record.date}
                      </p>
                      <p className="text-xs text-gray-500">
                        📍 {record.location}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Récords Nacionales
          </CardTitle>
          <CardDescription className="text-base">
            Mejores marcas nacionales por categoría de edad y tipo de piscina
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Selector de Tipo de Piscina */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            Tipo de Piscina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handlePoolChange("corta")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedPool === "corta"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5" />
                <div className="text-left">
                  <div>Piscina Corta</div>
                  <div className="text-xs opacity-80">25 metros</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => handlePoolChange("larga")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedPool === "larga"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5" />
                <div className="text-left">
                  <div>Piscina Larga</div>
                  <div className="text-xs opacity-80">50 metros</div>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Selector de Categoría de Edad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Categoría de Edad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange("11-12")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === "11-12"
                  ? "bg-yellow-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              11-12 años
            </button>
            <button
              onClick={() => handleCategoryChange("13-14")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === "13-14"
                  ? "bg-yellow-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              13-14 años
            </button>
            <button
              onClick={() => handleCategoryChange("15-17")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === "15-17"
                  ? "bg-yellow-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              15-17 años
            </button>
            <button
              onClick={() => handleCategoryChange("absoluto")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === "absoluto"
                  ? "bg-yellow-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Absoluto
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Selector de Género */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Género
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleGenderChange("femenino")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedGender === "femenino"
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Femenino
            </button>
            <button
              onClick={() => handleGenderChange("masculino")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedGender === "masculino"
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Masculino
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Filtro por Prueba */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" />
            Filtrar por Prueba
          </CardTitle>
          <CardDescription>
            Selecciona una prueba específica o muestra todas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedEvent("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedEvent === "all"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todas las pruebas ({getAvailableEvents().length})
            </button>
            {getAvailableEvents().map((event) => (
              <button
                key={event}
                onClick={() => setSelectedEvent(event)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedEvent === event
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {event}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información de Selección Actual */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-600 mb-1">Mostrando récords para:</p>
              <p className="text-lg font-bold text-gray-800">
                {getPoolTypeLabel(selectedPool)} • {getCategoryLabel(selectedCategory)} • {getGenderLabel(selectedGender)}
                {selectedEvent !== "all" && (
                  <>
                    {" • "}
                    <span className="text-green-600">{selectedEvent}</span>
                  </>
                )}
              </p>
              {selectedEvent === "all" && (
                <p className="text-xs text-gray-500 mt-1">
                  Mostrando todas las pruebas ({getAvailableEvents().length})
                </p>
              )}
            </div>
            <Button
              onClick={generateRecordsPDF}
              className="bg-red-600 hover:bg-red-700 text-white shrink-0"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Récords */}
      <div>
        {renderRecordsTable()}
      </div>
    </div>
  );
}