## component "RouteList"

Данный компонент нужен для вывода рекомендованных и моих маршрутов в виде плашек

### Установка
``` vuejs
<template>
    <List 
        isRecomended 
        :data="routeList"
        :config="config"
    />
</template>

<script>
    import List from '../components/route-list'
    export default {
        data() {
            return {
                routeList: [...],
                config: {
                    maxCount: 10 // для пагинации (по умолчанию выводить все)
                    colDesktop: 3 // количесво плашек в линию для десктопа (по умолчанию 1)
                    colTablet: 2 // количесво плашек в линию для планшета (по умолчанию 1)
                }
            }
        },

    }
</script>    
```