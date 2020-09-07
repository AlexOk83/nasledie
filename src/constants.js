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
        date: '2020-09-07', // получаем из даты старта
        timeStart: '09:00', // получаем из время старта
        timeEnd: '20:00',   // расчитывается скриптом
        objects: [
            {
                name: "Владикавказ",
                coordinates: [50, 40]
            },
            {
                name: "Музей 'Горы кавказа",
                coordinates: [50, 40],
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: "car"
            },
            {
                name: "Заповедник Северного кавказа",
                coordinates: [50, 40],
                timeInWay: 90,
                way: 5000,
                stopTime: 45,
                time: 90,
                typeMovement: "car"
            },
            {
                name: "Термальный источник",
                coordinates: [50, 40],
                timeInWay: 90,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: "people"
            }
        ],

    },
    {
        id: 2,
        date: '2020-09-08', // получаем из даты старта
        timeStart: '08:00', // получаем из время старта
        timeEnd: '20:00',   // расчитывается скриптом
        objects: [
            {
                name: "Владикавказ",
                coordinates: [50, 40]
            },
            {
                name: "Музей 'Горы кавказа",
                coordinates: [50, 40],
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: "car"
            },
            {
                name: "Заповедник Северного кавказа",
                coordinates: [50, 40],
                timeInWay: 90,
                way: 5000,
                stopTime: 45,
                time: 90,
                typeMovement: "car"
            },
            {
                name: "Термальный источник",
                coordinates: [50, 40],
                timeInWay: 90,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: "people"
            }
        ],

    },
    {
        id: 3,
        date: '2020-09-09', // получаем из даты старта
        timeStart: '07:00', // получаем из время старта
        timeEnd: '20:00',   // расчитывается скриптом
        objects: [
            {
                name: "Владикавказ",
                coordinates: [50, 40]
            },
            {
                name: "Музей 'Горы кавказа",
                coordinates: [50, 40],
                timeInWay: 330,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: "car"
            },
            {
                name: "Заповедник Северного кавказа",
                coordinates: [50, 40],
                timeInWay: 90,
                way: 5000,
                stopTime: 45,
                time: 90,
                typeMovement: "car"
            },
            {
                name: "Термальный источник",
                coordinates: [50, 40],
                timeInWay: 90,
                way: 5000,
                stopTime: 30,
                time: 90,
                typeMovement: "people"
            }
        ],

    }
];
