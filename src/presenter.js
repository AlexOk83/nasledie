export class Presenter {
    getWay(way) {
        const w = way / 1000;
        if (w < 1) {
            return `${way} м`
        }

        return `${w} км`
    }
    getTime(time) {
        const t = time / 60;
        if (t < 1) {
            return `${time} минут`
        }
        const dec = this.getDeclinedRemainder(Math.floor(t), ['час', 'часа', 'часов'])

        return `${dec} ${time % 60} минут`
    }
    getDeclinedRemainder(number, declensions) {
        const stringNumber = String(number);
        const [one, two, other] = declensions;
        const lastSimbol = stringNumber[stringNumber.length - 1];
        const balance = Number(lastSimbol);

        if (balance === 1) {
            return `${number} ${one}`
        }
        if (balance < 5 && balance !== 0) {
            return `${number} ${two}`
        }
        return `${number} ${other}`
    }
    getNameMovement(movement) {
        switch (movement) {
            case('people'): return "Пеший";
            case('car'): return "Автомобильный";
            case('ship'): return "По воде";
            default: return "";
        }
    }
}