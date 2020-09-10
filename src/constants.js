export const typesOfMovement = [
    {name: 'Пеший', value: 'people', icon: 'people', disabled: false},
    {name: 'Автомобильный', value: 'car', icon: 'car', disabled: false},
    {name: 'Водный транспорт', value: 'ship', icon: 'ship', disabled: true},
    {name: 'Авиа', value: 'plane', icon: 'plane', disabled: true},
    {name: 'ЖД транспорт', value: 'train', icon: 'train', disabled: true},
];

export const radioButtonOptions = [
    {name: 'Да', value: 'yes'},
    {name: 'Нет', value: 'no'},
];

export const settingsScroll = {
    maxScrollbarLength: 200,
    wheelPropagation: false,
}

export const MockDays = [
    {
        id: 1,
        name: "1 День",
        dateStart: '2020-09-07', // получаем из даты старта
        dateEnd: '2020-09-07', // получаем из даты старта
        timeStart: '09:00', // получаем из время старта
        timeEnd: '20:00',   // расчитывается скриптом
        startPoint: 'Владикавказ',
        startPointCoordLat: 50,
        startPointCoordLong: 40,
        endPoint: 'Владикавказ',
        endPointCoordLat: 50,
        endPointCoordLong: 40,
        objects: [
            {
                object_id: 407,
                name: "Владикавказ",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: ["car"]
            },
            {
                object_id: 408,
                name: "Музей 'Горы кавказа",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: ["car"]
            },
            {
                object_id: 409,
                name: "Заповедник Северного кавказа",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 90,
                way: 5000,
                stopTime: 45,
                time: 90,
                typeMovement: ["car"]
            }
        ],

    },
    {
        id: 2,
        name: "2 День",
        dateStart: '2020-09-08', // получаем из даты старта
        dateEnd: '2020-09-08', // получаем из даты старта
        timeStart: '09:00', // получаем из время старта
        timeEnd: '20:00',   // расчитывается скриптом
        startPoint: 'Владикавказ',
        startPointCoordLat: 50,
        startPointCoordLong: 40,
        endPoint: 'Владикавказ',
        endPointCoordLat: 50,
        endPointCoordLong: 40,
        objects: [
            {
                object_id: 407,
                name: "Владикавказ",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: ["car"]
            },
            {
                object_id: 408,
                name: "Музей 'Горы кавказа",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: ["car"]
            },
            {
                object_id: 409,
                name: "Заповедник Северного кавказа",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 90,
                way: 5000,
                stopTime: 45,
                time: 90,
                typeMovement: ["car"]
            }
        ],

    },
    {
        id: 3,
        name: "3 День",
        dateStart: '2020-09-09', // получаем из даты старта
        dateEnd: '2020-09-09', // получаем из даты старта
        timeStart: '09:00', // получаем из время старта
        timeEnd: '20:00',   // расчитывается скриптом
        startPoint: 'Владикавказ',
        startPointCoordLat: 50,
        startPointCoordLong: 40,
        endPoint: 'Владикавказ',
        endPointCoordLat: 50,
        endPointCoordLong: 40,
        objects: [
            {
                object_id: 407,
                name: "Владикавказ",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: ["car"]
            },
            {
                object_id: 408,
                name: "Музей 'Горы кавказа",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: ["car"]
            },
            {
                object_id: 409,
                name: "Заповедник Северного кавказа",
                startPointCoordLat: 50,
                startPointCoordLong: 40,
                timeInWay: 90,
                way: 5000,
                stopTime: 45,
                time: 90,
                typeMovement: ["car"]
            }
        ],

    }
];
