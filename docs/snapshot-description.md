## Формат данных

Сохраняемые данные (обязательные):

* **метаданные сессии**: этап, трасса, тип сессии, статус, время, фаза квалификации/гонки;
* **статус трассы и сессии**: green/yellow/red/VSC/SC, started/aborted/finished/finalised;
* **список гонщиков и команд**: номер, имя, аббревиатура, команда, цвет команды;
* **классификацию по каждому болиду**: позиция, line/order, круги, inPit, pitOut, retired, stopped;
* **тайминг**: best lap, last lap, diff to leader, diff to car ahead;
* **сектора и сегменты**: значения секторов, personal/overall fastest, segment status;
* **скорости**: I1, I2, FL, ST; best speeds и текущие скорости в timing;
* **шины и стинты**: compound, new, total laps, start laps, lap number/lap time стинта;
* **race control messages**;
* **team radio** как список событий-ссылок;
* **погоду**: air temp, track temp, humidity, pressure, rainfall, wind.

Опционально:
* top_three как отдельный готовый виджетовый блок, если хотите быстро рисовать header без пересборки из drivers; в raw он есть.  ￼
* qualifying_part / session_part, если один контракт должен обслуживать и практику, и квалификацию, и гонку.

### Контракт

```json
{
  "schema_version": {
    "type": "integer",
    "required": true,
    "description": "Версия контракта snapshot. Нужна для безопасной эволюции схемы на backend и mobile."
  },
  "snapshot_id": {
    "type": "string",
    "required": true,
    "description": "Уникальный идентификатор снапшота."
  },
  "session_key": {
    "type": "string",
    "required": true,
    "description": "Стабильный идентификатор сессии в рамках этапа. Используется как ключ потока/кэша/истории."
  },
  "sequence": {
    "type": "integer",
    "required": true,
    "description": "Монотонно растущий номер snapshot внутри одной сессии."
  },
  "generated_at": {
    "type": "string(date-time, ISO 8601 UTC)",
    "required": true,
    "description": "Момент, когда Aggregator собрал текущий snapshot."
  },
  "source_timestamp": {
    "type": "string(date-time, ISO 8601 UTC)",
    "required": true,
    "description": "Максимальный timestamp среди raw-событий, вошедших в snapshot."
  },
  "interval_ms": {
    "type": "integer",
    "required": true,
    "enum": [2000],
    "description": "Шаг формирования snapshot в миллисекундах."
  },
  "session": {
    "type": "object",
    "required": true,
    "description": "Метаданные этапа и сессии.",
    "properties": {
      "meeting_key": {
        "type": "integer|null",
        "description": "Идентификатор этапа чемпионата."
      },
      "session_key": {
        "type": "integer|null",
        "description": "Идентификатор конкретной сессии у поставщика данных."
      },
      "grand_prix_name": {
        "type": "string",
        "description": "Короткое название этапа, например Australian Grand Prix."
      },
      "official_name": {
        "type": "string|null",
        "description": "Полное официальное название этапа."
      },
      "location": {
        "type": "string|null",
        "description": "Город/локация проведения этапа."
      },
      "country_code": {
        "type": "string|null",
        "description": "Код страны проведения этапа, например AUS."
      },
      "country_name": {
        "type": "string|null",
        "description": "Название страны проведения этапа."
      },
      "circuit_short_name": {
        "type": "string|null",
        "description": "Короткое название трассы."
      },
      "session_type": {
        "type": "string",
        "enum": ["race", "qualifying", "practice", "sprint", "unknown"],
        "description": "Тип сессии в нормализованном виде."
      },
      "session_name": {
        "type": "string",
        "description": "Человекочитаемое название сессии, например Race, Qualifying, Practice 2."
      },
      "session_number": {
        "type": "integer|null",
        "description": "Номер сессии, если применимо."
      },
      "session_part": {
        "type": "integer|null",
        "description": "Текущая часть сессии, если поставщик отдает ее отдельно. Например для qualifying."
      },
      "qualifying_part": {
        "type": "integer|null",
        "description": "Текущий сегмент квалификации: 1, 2 или 3."
      },
      "start_time": {
        "type": "string(date-time, ISO 8601 UTC)|null",
        "description": "Время старта сессии."
      },
      "end_time": {
        "type": "string(date-time, ISO 8601 UTC)|null",
        "description": "Плановое время окончания сессии."
      },
      "gmt_offset": {
        "type": "string|null",
        "description": "Смещение часового пояса источника."
      }
    }
  },
  "race_state": {
    "type": "object",
    "required": true,
    "description": "Текущее общее состояние сессии и трассы.",
    "properties": {
      "session_status": {
        "type": "string",
        "enum": ["pending", "inactive", "started", "aborted", "finished", "finalised", "ends", "unknown"],
        "description": "Нормализованный статус сессии."
      },
      "track_status": {
        "type": "string",
        "enum": ["all_clear", "yellow", "double_yellow", "red", "vsc", "safety_car", "chequered", "unknown"],
        "description": "Нормализованный статус трассы."
      },
      "track_status_message": {
        "type": "string|null",
        "description": "Текстовый статус трассы из источника, например AllClear."
      },
      "clock": {
        "type": "object",
        "description": "Текущее время и остаток по сессии.",
        "properties": {
          "utc": {
            "type": "string(date-time, ISO 8601 UTC)",
            "description": "Временная отметка snapshot."
          },
          "remaining_ms": {
            "type": "integer|null",
            "description": "Оставшееся время сессии в миллисекундах."
          },
          "extrapolating": {
            "type": "boolean",
            "description": "Признак, что остаток времени экстраполируется, а не приходит как финальное значение."
          }
        }
      },
      "leader_racing_number": {
        "type": "string|null",
        "description": "Номер лидирующего пилота по текущей классификации."
      },
      "total_cars": {
        "type": "integer",
        "description": "Общее количество машин в snapshot."
      },
      "classified_cars": {
        "type": "integer",
        "description": "Количество машин, присутствующих в классификации."
      }
    }
  },
  "weather": {
    "type": "object|null",
    "required": false,
    "description": "Погодные данные с трассы. Источник отдает их отдельным блоком WeatherData.",
    "properties": {
      "air_temp_c": {
        "type": "number|null",
        "description": "Температура воздуха в градусах Цельсия."
      },
      "track_temp_c": {
        "type": "number|null",
        "description": "Температура полотна трассы в градусах Цельсия."
      },
      "humidity_pct": {
        "type": "number|null",
        "description": "Влажность воздуха в процентах."
      },
      "pressure_hpa": {
        "type": "number|null",
        "description": "Атмосферное давление."
      },
      "rainfall": {
        "type": "number|null",
        "description": "Осадки. Хранится как числовое значение из источника после нормализации."
      },
      "wind_direction_deg": {
        "type": "integer|null",
        "description": "Направление ветра в градусах."
      },
      "wind_speed_mps": {
        "type": "number|null",
        "description": "Скорость ветра."
      }
    }
  },
  "drivers": {
    "type": "array<object>",
    "required": true,
    "description": "Полный список пилотов с текущим состоянием. Это основной блок для экрана телеметрии.",
    "sort": "position asc, line asc",
    "items": {
      "racing_number": {
        "type": "string",
        "description": "Гоночный номер пилота. Основной ключ пилота внутри snapshot."
      },
      "line": {
        "type": "integer",
        "description": "Порядок строки в официальном тайминге."
      },
      "position": {
        "type": "integer|null",
        "description": "Текущая позиция пилота."
      },
      "show_position": {
        "type": "boolean",
        "description": "Нужно ли показывать позицию в официальном UI-тайминге."
      },
      "identity": {
        "type": "object",
        "description": "Статические и квазистатические данные пилота и команды.",
        "properties": {
          "tla": {
            "type": "string",
            "description": "Трехбуквенное сокращение пилота."
          },
          "broadcast_name": {
            "type": "string|null",
            "description": "Имя в broadcast-формате."
          },
          "full_name": {
            "type": "string",
            "description": "Полное имя пилота."
          },
          "first_name": {
            "type": "string|null",
            "description": "Имя пилота."
          },
          "last_name": {
            "type": "string|null",
            "description": "Фамилия пилота."
          },
          "team_name": {
            "type": "string",
            "description": "Название команды."
          },
          "team_color": {
            "type": "string",
            "description": "HEX-цвет команды без #."
          }
        }
      },
      "timing": {
        "type": "object",
        "description": "Текущие тайминги пилота: отставания, круги, сектора, скорости.",
        "properties": {
          "number_of_laps": {
            "type": "integer|null",
            "description": "Количество завершенных кругов."
          },
          "gap_to_leader": {
            "type": "string|null",
            "description": "Отставание от лидера в display-формате."
          },
          "interval_to_ahead": {
            "type": "string|null",
            "description": "Отставание от машины впереди в display-формате."
          },
          "best_lap": {
            "type": "object|null",
            "description": "Лучший круг пилота.",
            "properties": {
              "value": {
                "type": "string|null",
                "description": "Время круга в формате M:SS.mmm."
              },
              "lap": {
                "type": "integer|null",
                "description": "Номер круга, на котором показано лучшее время."
              },
              "status_code": {
                "type": "integer|null",
                "description": "Raw status из источника, если нужен для совместимости."
              },
              "personal_fastest": {
                "type": "boolean|null",
                "description": "Признак личного лучшего круга."
              },
              "overall_fastest": {
                "type": "boolean|null",
                "description": "Признак абсолютного лучшего круга сессии."
              }
            }
          },
          "last_lap": {
            "type": "object|null",
            "description": "Последний завершенный круг пилота.",
            "properties": {
              "value": {
                "type": "string|null",
                "description": "Время круга в формате M:SS.mmm."
              },
              "lap": {
                "type": "integer|null",
                "description": "Номер последнего круга."
              },
              "status_code": {
                "type": "integer|null",
                "description": "Raw status из источника, если нужен для совместимости."
              },
              "personal_fastest": {
                "type": "boolean|null",
                "description": "Признак, что последний круг стал лучшим для пилота."
              },
              "overall_fastest": {
                "type": "boolean|null",
                "description": "Признак, что последний круг стал лучшим в сессии."
              }
            }
          },
          "sectors": {
            "type": "array<object>",
            "description": "Три сектора текущего/последнего круга.",
            "items": {
              "sector": {
                "type": "integer",
                "enum": [1, 2, 3],
                "description": "Номер сектора."
              },
              "value": {
                "type": "string|null",
                "description": "Время сектора в формате SS.mmm."
              },
              "previous_value": {
                "type": "string|null",
                "description": "Предыдущее значение сектора, если приходит от источника."
              },
              "stopped": {
                "type": "boolean",
                "description": "Признак, что машина остановлена в этом секторе."
              },
              "status_code": {
                "type": "integer|null",
                "description": "Raw status сектора."
              },
              "personal_fastest": {
                "type": "boolean|null",
                "description": "Признак лучшего сектора для данного пилота."
              },
              "overall_fastest": {
                "type": "boolean|null",
                "description": "Признак абсолютного лучшего сектора сессии."
              },
              "segments": {
                "type": "array<object>",
                "description": "Детализация сегментов внутри сектора, если она нужна для UI.",
                "items": {
                  "segment": {
                    "type": "integer",
                    "description": "Порядковый номер сегмента внутри сектора."
                  },
                  "status_code": {
                    "type": "integer",
                    "description": "Raw status сегмента."
                  }
                }
              }
            }
          },
          "speeds": {
            "type": "object",
            "description": "Текущие контрольные скорости по точкам трассы.",
            "properties": {
              "i1": {
                "type": "object|null",
                "description": "Скорость на intermediate 1.",
                "properties": {
                  "value": {
                    "type": "number|null",
                    "description": "Значение скорости."
                  },
                  "status_code": {
                    "type": "integer|null",
                    "description": "Raw status скорости."
                  },
                  "personal_fastest": {
                    "type": "boolean|null",
                    "description": "Личный лучший результат по этой точке."
                  },
                  "overall_fastest": {
                    "type": "boolean|null",
                    "description": "Абсолютный лучший результат по этой точке."
                  }
                }
              },
              "i2": {
                "type": "object|null",
                "description": "Скорость на intermediate 2.",
                "properties": {
                  "value": {
                    "type": "number|null",
                    "description": "Значение скорости."
                  },
                  "status_code": {
                    "type": "integer|null",
                    "description": "Raw status скорости."
                  },
                  "personal_fastest": {
                    "type": "boolean|null",
                    "description": "Личный лучший результат по этой точке."
                  },
                  "overall_fastest": {
                    "type": "boolean|null",
                    "description": "Абсолютный лучший результат по этой точке."
                  }
                }
              },
              "fl": {
                "type": "object|null",
                "description": "Скорость на линии финиша.",
                "properties": {
                  "value": {
                    "type": "number|null",
                    "description": "Значение скорости."
                  },
                  "status_code": {
                    "type": "integer|null",
                    "description": "Raw status скорости."
                  },
                  "personal_fastest": {
                    "type": "boolean|null",
                    "description": "Личный лучший результат по этой точке."
                  },
                  "overall_fastest": {
                    "type": "boolean|null",
                    "description": "Абсолютный лучший результат по этой точке."
                  }
                }
              },
              "st": {
                "type": "object|null",
                "description": "Скорость на speed trap.",
                "properties": {
                  "value": {
                    "type": "number|null",
                    "description": "Значение скорости."
                  },
                  "status_code": {
                    "type": "integer|null",
                    "description": "Raw status скорости."
                  },
                  "personal_fastest": {
                    "type": "boolean|null",
                    "description": "Личный лучший результат по этой точке."
                  },
                  "overall_fastest": {
                    "type": "boolean|null",
                    "description": "Абсолютный лучший результат по этой точке."
                  }
                }
              }
            }
          },
          "best_sectors": {
            "type": "array<object>",
            "description": "Лучшие сектора пилота за сессию. Особенно полезно для квалификации и практики.",
            "items": {
              "sector": {
                "type": "integer",
                "enum": [1, 2, 3],
                "description": "Номер сектора."
              },
              "value": {
                "type": "string|null",
                "description": "Лучшее время сектора."
              },
              "position": {
                "type": "integer|null",
                "description": "Место пилота по данному сектору среди всех."
              }
            }
          },
          "best_speeds": {
            "type": "object|null",
            "description": "Лучшие скорости пилота за сессию.",
            "properties": {
              "i1": {
                "type": "object|null",
                "properties": {
                  "value": {
                    "type": "number|null",
                    "description": "Лучшее значение скорости в точке I1."
                  },
                  "position": {
                    "type": "integer|null",
                    "description": "Место пилота по I1."
                  }
                }
              },
              "i2": {
                "type": "object|null",
                "properties": {
                  "value": {
                    "type": "number|null",
                    "description": "Лучшее значение скорости в точке I2."
                  },
                  "position": {
                    "type": "integer|null",
                    "description": "Место пилота по I2."
                  }
                }
              },
              "fl": {
                "type": "object|null",
                "properties": {
                  "value": {
                    "type": "number|null",
                    "description": "Лучшее значение скорости на линии финиша."
                  },
                  "position": {
                    "type": "integer|null",
                    "description": "Место пилота по FL."
                  }
                }
              },
              "st": {
                "type": "object|null",
                "properties": {
                  "value": {
                    "type": "number|null",
                    "description": "Лучшее значение скорости на speed trap."
                  },
                  "position": {
                    "type": "integer|null",
                    "description": "Место пилота по ST."
                  }
                }
              }
            }
          }
        }
      },
      "tyres": {
        "type": "object",
        "description": "Текущее состояние шин и история стинтов.",
        "properties": {
          "current_compound": {
            "type": "string",
            "enum": ["soft", "medium", "hard", "intermediate", "wet", "unknown"],
            "description": "Текущий состав шин."
          },
          "is_new": {
            "type": "boolean|null",
            "description": "Новый ли текущий комплект."
          },
          "tyre_age_laps": {
            "type": "integer|null",
            "description": "Возраст текущего комплекта шин в кругах."
          },
          "tyres_not_changed": {
            "type": "boolean|null",
            "description": "Признак, что комплект не менялся."
          },
          "stints": {
            "type": "array<object>",
            "description": "История стинтов пилота за текущую сессию.",
            "items": {
              "index": {
                "type": "integer",
                "description": "Порядковый номер стинта внутри массива."
              },
              "compound": {
                "type": "string",
                "enum": ["soft", "medium", "hard", "intermediate", "wet", "unknown"],
                "description": "Состав шин в этом стинте."
              },
              "is_new": {
                "type": "boolean|null",
                "description": "Новый ли был комплект на старте стинта."
              },
              "total_laps": {
                "type": "integer",
                "description": "Общее число кругов на этом комплекте."
              },
              "start_laps": {
                "type": "integer",
                "description": "Значение стартового счетчика кругов, если отдается источником."
              },
              "lap_flags": {
                "type": "integer|null",
                "description": "Raw flags для стинта."
              },
              "tyres_not_changed": {
                "type": "boolean|null",
                "description": "Признак, что шины в рамках записи стинта не менялись."
              },
              "reference_lap_time": {
                "type": "string|null",
                "description": "Контрольное время круга, связанное со стинтом, если приходит."
              },
              "reference_lap_number": {
                "type": "integer|null",
                "description": "Номер круга для reference_lap_time."
              }
            }
          }
        }
      },
      "track": {
        "type": "object",
        "description": "Состояние машины на трассе.",
        "properties": {
          "in_pit": {
            "type": "boolean",
            "description": "Машина находится в пит-лейне."
          },
          "pit_out": {
            "type": "boolean",
            "description": "Машина только что покинула пит-лейн."
          },
          "stopped": {
            "type": "boolean",
            "description": "Машина остановлена."
          },
          "retired": {
            "type": "boolean",
            "description": "Машина сошла."
          },
          "knocked_out": {
            "type": "boolean|null",
            "description": "Пилот выбыл из квалификационного сегмента."
          },
          "cutoff": {
            "type": "boolean|null",
            "description": "Пилот находится в зоне отсечения в квалификации."
          },
          "status_code": {
            "type": "integer|null",
            "description": "Raw status машины из источника."
          }
        }
      }
    }
  },
  "race_control_messages": {
    "type": "array<object>",
    "required": true,
    "description": "Полный накопленный список сообщений race control за сессию. Хранится целиком и отсортирован от новых к старым.",
    "sort": "utc desc",
    "items": {
      "id": {
        "type": "string",
        "description": "Стабильный идентификатор сообщения. Желательно формировать хешем по utc + category + message + sector/flag."
      },
      "utc": {
        "type": "string(date-time, ISO 8601 UTC)",
        "description": "Время публикации сообщения."
      },
      "category": {
        "type": "string",
        "description": "Категория сообщения, например Flag, Other, SafetyCar, DRS, Penalty."
      },
      "message": {
        "type": "string",
        "description": "Текст сообщения race control."
      },
      "flag": {
        "type": "string|null",
        "description": "Тип флага, если сообщение относится к флагам."
      },
      "scope": {
        "type": "string|null",
        "description": "Область действия: Track, Sector, Driver и т.п."
      },
      "sector": {
        "type": "integer|null",
        "description": "Номер сектора, если сообщение относится к конкретному сектору."
      },
      "mode": {
        "type": "string|null",
        "description": "Нормализованный режим для UI, например green, yellow, red, vsc, sc."
      }
    }
  },
  "team_radio": {
    "type": "array<object>",
    "required": true,
    "description": "Полный накопленный список team radio за сессию. Хранится целиком и отсортирован от новых к старым.",
    "sort": "utc desc",
    "items": {
      "id": {
        "type": "string",
        "description": "Стабильный идентификатор записи radio. Желательно формировать хешем по utc + racing_number + path."
      },
      "utc": {
        "type": "string(date-time, ISO 8601 UTC)",
        "description": "Время появления записи radio."
      },
      "racing_number": {
        "type": "string",
        "description": "Гоночный номер пилота, к которому относится radio."
      },
      "path": {
        "type": "string",
        "description": "Путь или ключ к аудиофайлу radio."
      }
    }
  }
}
```

DTO:

```ts
export type SessionType = "race" | "qualifying" | "practice" | "sprint" | "unknown";

export type TrackStatus =
  | "all_clear"
  | "yellow"
  | "double_yellow"
  | "red"
  | "vsc"
  | "safety_car"
  | "chequered"
  | "unknown";

export type SessionStatus =
  | "pending"
  | "started"
  | "inactive"
  | "aborted"
  | "finished"
  | "finalised"
  | "ends"
  | "unknown";

export type TyreCompound =
  | "soft"
  | "medium"
  | "hard"
  | "intermediate"
  | "wet"
  | "unknown";

export type RaceSnapshot = {
  schema_version: number;              // версия контракта
  snapshot_id: string;                 // уникальный id снапшота
  session_key: string;                 // стабильный ключ сессии
  sequence: number;                    // порядковый номер снапшота
  generated_at: string;                // ISO UTC, когда Aggregator собрал snapshot
  source_timestamp: string;            // ISO UTC, max timestamp из входящих событий
  interval_ms: 2000;                   // 2000
  is_delta_from_previous: false;       // для snapshot всегда false

  session: SessionMeta;
  race_state: RaceState;
  weather?: WeatherData;
  drivers: DriverState[];
  race_control: RaceControlMessage[];
  team_radio: TeamRadioCapture[];
};
```

#### Session

```ts
export type SessionMeta = {
  meeting_key?: number;
  session_key?: number;
  grand_prix_name: string;             // Australian Grand Prix
  official_name?: string;              // FORMULA 1 ...
  location?: string;                   // Melbourne
  country_code?: string;               // AUS
  country_name?: string;               // Australia
  circuit_short_name?: string;         // Melbourne

  session_type: SessionType;           // race / qualifying / practice
  session_name: string;                // Practice 3 / Qualifying / Race
  session_number?: number;             // 1,2,3 if available
  qualifying_part?: number | null;     // Q1/Q2/Q3 -> 1/2/3
  session_part?: number | null;        // общий part если приходит так

  start_time?: string;                 // ISO with timezone normalized to UTC
  end_time?: string;                   // ISO with timezone normalized to UTC
  gmt_offset?: string;                 // source info
};
```

#### Race state

```ts
export type RaceState = {
    session_status: SessionStatus;
    track_status: TrackStatus;
    track_status_message?: string;       // "AllClear", etc.
    clock: {
        utc: string;                       // текущее серверное время снапшота
        remaining_ms?: number | null;      // оставшееся время в сессии
        extrapolating?: boolean;
    };

    classification_generated_at: string; // когда рассчитана таблица
    leader_racing_number?: string | null;
    total_cars: number;
    classified_cars: number;
};
```

#### Wheather

```ts
export type WeatherData = {
    air_temp_c?: number | null;
    track_temp_c?: number | null;
    humidity_pct?: number | null;
    pressure_hpa?: number | null;
    rainfall_mm?: number | null;         // либо 0/1, зависит от нормализации
    wind_direction_deg?: number | null;
    wind_speed_mps?: number | null;      // можно хранить как есть от источника, но единицу лучше зафиксировать в контракте
};
```

#### Drivers

```ts
export type DriverState = {
    racing_number: string;               // "44"
    line: number;                        // порядок строки в официальном timing
    position: number | null;             // позиция в классификации
    show_position: boolean;

    identity: DriverIdentity;
    timing: DriverTiming;
    tyres: DriverTyres;
    track: DriverTrackState;
};
```

#### Identity

```ts
export type DriverIdentity = {
    tla: string;                         // HAM
    broadcast_name?: string;             // L HAMILTON
    full_name: string;                   // Lewis Hamilton
    first_name?: string;
    last_name?: string;
    team_name: string;                   // Ferrari
    team_color: string;                  // ED1131
};
```

#### Timing

```ts
export type DriverTiming = {
    number_of_laps?: number | null;

    gap_to_leader?: string | null;       // "+5.231"
    interval_to_ahead?: string | null;   // "+0.417"

    best_lap: LapTimeInfo | null;
    last_lap: LapTimeInfo | null;

    sectors: SectorInfo[];               // обычно 3
    speeds: SpeedTrapInfo;               // I1/I2/FL/ST

    best_sectors?: BestSectorInfo[];     // для quali/practice
    best_speeds?: BestSpeedInfo | null;  // best I1/I2/FL/ST
};
```

```ts
export type LapTimeInfo = {
    value: string | null;                // "1:21.818"
    lap?: number | null;
    status?: number | null;              // raw timing status, если нужно для UI-иконок
    personal_fastest?: boolean;
    overall_fastest?: boolean;
};
```

```ts
export type SectorInfo = {
    sector: 1 | 2 | 3;
    value: string | null;                // "34.920"
    previous_value?: string | null;
    stopped?: boolean;
    status?: number | null;
    personal_fastest?: boolean;
    overall_fastest?: boolean;
    segments?: SegmentInfo[];
};
```

```ts
export type SegmentInfo = {
    segment: number;
    status: number;                      // raw status code из F1
};
```

```ts
export type SpeedTrapInfo = {
    i1?: SpeedValue | null;              // intermediate 1
    i2?: SpeedValue | null;              // intermediate 2
    fl?: SpeedValue | null;              // finish line
    st?: SpeedValue | null;              // speed trap
};

export type SpeedValue = {
    value: number | null;                // km/h
    status?: number | null;
    personal_fastest?: boolean;
    overall_fastest?: boolean;
};
```

```ts
export type BestSectorInfo = {
    sector: 1 | 2 | 3;
    value: string | null;
    position?: number | null;            // rank among drivers
};

export type BestSpeedInfo = {
    i1?: { value: number | null };
    i2?: { value: number | null };
    fl?: { value: number | null };
    st?: { value: number | null };
};
```

#### Tyres

```ts
export type DriverTyres = {
    current_compound: TyreCompound;
    is_new?: boolean | null;
    tyre_age_laps?: number | null;       // сколько кругов на текущем комплекте
    tyres_not_changed?: boolean | null;

    stints: TyreStint[];
};

export type TyreStint = {
    index: number;
    compound: TyreCompound;
    is_new: boolean | null;
    total_laps: number;
    start_laps: number;
    lap_flags?: number | null;
    tyres_not_changed?: boolean | null;

    reference_lap_time?: string | null;  // если пришёл LapTime
    reference_lap_number?: number | null;
};
```

#### Track

```ts
export type DriverTrackState = {
    in_pit: boolean;
    pit_out: boolean;
    stopped: boolean;
    retired: boolean;
    knocked_out?: boolean;               // для квалификации
    cutoff?: boolean;                    // для квалификации
    status_code?: number | null;         // raw F1 status, если нужен для совместимости
};
```

#### Race control messages

```ts
export type RaceControlMessage = {
    id: string;                          // стабильный id, например hash(Utc+Message)
    utc: string;
    category: "flag" | "safety_car" | "drs" | "other" | "penalty" | "incident";
    message: string;

    flag?: "green" | "yellow" | "double_yellow" | "red" | "clear" | "chequered";
    scope?: "track" | "sector" | "driver";
    sector?: number | null;

    safety_car_mode?: "sc" | "vsc" | null;
    safety_car_status?: "deployed" | "ending" | "in_this_lap" | null;
};
```

#### Team radio

```ts
export type TeamRadioCapture = {
    id: string;
    utc: string;
    racing_number: string;
    path: string;                        // относительный путь / ссылка на mp3
};
```