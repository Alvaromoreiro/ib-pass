# Workflows

Se han generado varios casos de test de aceptación para las diferentes opciones de contratar vuelos a través de la aplicación de BKI. Para ello se han organizado por tipos:

- Obtención: Vuelos sin logarse.
- Redención: Vuelos logados y que puede utilizarse avios.
- PA: Vuelos de la conexión MAD-BCN.
- Multisearch: Diferentes vuelos que pueden no estar conectados.
- Metasearch: Vuelos que se obtienen a través de una página externa como Google Flights.
- OB: Vuelos logados con un usuario especial de empresas.
- Flash Offers: Vuelos exclusivos de la página de Flash Offers. El usuario tiene que estar logado.
- On Hold: Reserva de vuelos sin confirmación, la reserva puede ser gratuita o de pago.
- Slice by Slice: Vuelos sin logarse con disponibilidad slice por slice.

**Mantenimiento: Los flujos están pensados para actualizarse a finales de cada año pues la web está limitado a que funcione como mucho con vuelos a un año.**

## Obtención

Consta de 6 flujos de compra:
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe.
- Ida y vuelta MAD-MIA con escala el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe, añadiendo un asiento y maleta.
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y logados.
- Ida y vuelta MAD-BCN los días 22 y 23 de diciembre de 2023 de un pasajero.
- Ida con una escala para el trayecto AGP-BIO el día 22 de diciembre de 2023 de un pasajero.
- Ida y vuelta con una escala para el trayecto AGP-BIO el día 22 de diciembre de 2023 de un pasajero.

## Redención

Consta de 1 flujo de compra logado.

- Ida MAD-BCN el día 22 de diciembre de 2023 de un pasajero.

## PA

Consta de 3 flujos de compra, el caso de PA cambia el formato de selección de los vuelos entre MAD-BCN.

- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos.
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos y logado.
- Ida MAD-BCN el día 22 de diciembre de 2023 de un pasajero.

## Multisearch

Consta de 4 flujos de compra en el que se pueden añadir hasta 4 trayectos.

- Ida y vuelta MAD-BCN, BCN-BIO, BIO-PMI, PMI-MAD los días 22, 23, 24 y 25 de diciembre de 2023 con dos adultos, un niño y un bebe.
- Ida y vuelta MAD-MIA , MIA- NYC con escala el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe, añadiendo un asiento y maleta.
- Ida y vuelta MAD-BCN, BCN-BIO, BIO-PMI, PMI-MAD los días 22, 23, 24 y 25 de diciembre de 2023 con dos adultos, un niño y logado.
- Ida MAD-BCN, BCN-BIO, BIO-PMI, PMI-MAD los días 22, 23, 24 y 25 de diciembre de 2023 de un pasajero.
## Metasearch

Consta de 4 flujos de compra.

- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe.
- Ida y vuelta MAD-MIA con escala el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe, añadiendo un asiento y maleta.
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y logado.
- Ida y vuelta MAD-BCN los días 22 y 23 de noviembre de 2023 de un pasajero.

## OB

Consta de 1 flujo de compra logado especial para empresas (federico/Iberia21)

- Ida MAD-BCN el día 22 de diciembre de 2023 de un pasajero.
## On Hold

Consta de 2 flujos de compra.

- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe.
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y logado.
## Flash Offers

Consta de 3 flujos de compra.

- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe logado.
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe logado, añadiendo un asiento y maleta.
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y logado.

## Slice by Slice

Consta de 6 flujos de compra:
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe.
<!-- - Ida y vuelta MAD-MIA con escala el día 22 de diciembre de 2023 de dos adultos, un niño y un bebe, añadiendo un asiento y maleta.
- Ida y vuelta MAD-BCN el día 22 de diciembre de 2023 de dos adultos, un niño y logados.
- Ida y vuelta MAD-BCN los días 22 y 23 de diciembre de 2023 de un pasajero.
- Ida con una escala para el trayecto AGP-BIO el día 22 de diciembre de 2023 de un pasajero.
- Ida y vuelta con una escala para el trayecto AGP-BIO el día 22 de diciembre de 2023 de un pasajero. -->
# Características test de aceptación

- La resolución es para desktop.
- El environment es localhost.
- Deben ejecutarse en menos de minuto y medio a ser posible.
- Se ejecutarán los test de aceptación después de cada merge para comprobar que los flujos sean correctos.
- Se deben mockear todas las llamadas a servicios.
- Las llamadas a terceros se deben bloquear.
- Como buena práctica se pueden añadir clases semánticas.
- No se deben añadir id-test para las pruebas, es mejor añadir ids únicos.
- No se debe comprobar si los elementos existe, de no existir ya fallan al realizar las funciones get, find, check, click, etc.
- Hay que documentar en un readme.md todos los casos para poder ser mantenidos en el tiempo.