export class Presenter {
    getWay(way) {
        if (!way) {
            return 'Не указано'
        }
        const w = way / 1000;
        if (w < 1) {
            return `${way} м`
        }

        return `${w} км`
    }
    getTime(time) {
        if (!time) {
            return 'Не указано'
        }
        const t = time / 60;
        if (t < 1) {
            return `${time} минут`
        }
        const dec = this.getDeclinedRemainder(Math.floor(t), ['час', 'часа', 'часов']);
        const min = (time % 60 === 0) ? '' : `${time % 60} минут`;

        return `${dec} ${min}`
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
    moveItemUp(mass, index) {
        let localMass = [...mass];
        let temp = localMass[index - 1];
        localMass[index - 1] = localMass[index];
        localMass[index] = temp;
        return localMass
    }

    moveItemDown(mass, index) {
        let localMass = [...mass];
        let temp = localMass[index + 1];
        localMass[index + 1] = localMass[index];
        localMass[index] = temp;
        return localMass
    }
}