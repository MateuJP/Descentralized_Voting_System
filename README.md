# Descentralized Voting System

## Descripción del Proyecto

Este proyecto consiste en un sistema de votación descentralizado implementado en la red de Polygon.

La naturaleza descentralizada y las características de transparencia, inmutabilidad y trazabilidad hacen que la tecnología blockchain sea ideal para ser utilizada como base en la implementación de un sistema de votaciones descentralizado.

En este proyecto, se ha implementado una DApp Híbrida. Esto significa que una parte del backend está desplegada en Polygon y otra parte del backend está desplegada en una base de datos tradicional. Esto se debe a que guardar cadenas de texto en una blockchain no es una de las mejores prácticas. Por lo tanto, las descripciones de las votaciones y las opciones de cada votación se guardan en una base de datos tradicional, con la blockchain almacenando únicamente una referencia.

Además, se ha implementado un token ERC20 que otorga el derecho a participar en el proceso de votación. En un sistema de este tipo, cualquier usuario puede hacer un seguimiento de los votos que se van realizando de manera transparente y sin necesidad de depender de una autoridad central que valide el proceso. Los usuarios mismos pueden comprobar y validar los votos.

La implementación detallada de este proyecto se encuentra en la sección de documentación.

## Herramientas utilizadas

- **Frontend:** React
- **Backend:**
  - Solidity para programar los contratos `PollingStation.sol` y `Token.sol`
  - Hardhat para desplegar, compilar e interactuar con los contratos inteligentes
  - Node.js para programar la API REST
  - MySQL como motor de base de datos

## Siguientes pasos

Con el sistema tal como está actualmente, es posible ver qué opción ha elegido una billetera en particular. Sin embargo, dado que el objetivo de este proyecto es permitir que los suscriptores del canal voten sobre qué tema tratar en el siguiente blog/video, no es relevante que se pueda vincular una opción a una billetera. Debemos ser conscientes de que, aunque al analizar las transacciones en la cadena de bloques solo vemos las direcciones de las billeteras, es posible inferir la identidad detrás de dicha billetera, ya sea porque el usuario lo revela o porque termina llevando criptomonedas a un exchange que conoce su identidad.

Por tanto, el siguiente paso natural de esta aplicación será implementar un sistema de firmas ciegas. Este sistema permitirá que el usuario emita el voto sin que los demás puedan conocer el contenido. La idea detrás de las firmas ciegas es muy similar al sistema de votación tradicional. El usuario enviará su elección en un "sobre" firmado criptográficamente por sus claves, y el sistema verificará la autenticidad de la firma sin revelar el contenido del voto. De esta manera, se garantiza la privacidad y la integridad del proceso de votación, protegiendo la identidad y las elecciones individuales de los votantes.

Antes de hacer pública la aplicación, es crucial implementar medidas de seguridad para garantizar que solo los administradores puedan activar y crear votaciones. Aunque parte de esta seguridad ya está implementada en la blockchain, donde solo el propietario puede crear una votación, también es necesario proteger las rutas de la API REST. Para lograr esto, se utilizará la biblioteca JWT (JSON Web Tokens) para crear un sistema de inicio de sesión que emita un token al administrador. De esta manera, solo aquellos que presenten un token válido podrán acceder a las rutas protegidas de la API.
