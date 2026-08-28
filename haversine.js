// FÓRMULA DE HAVERSINE - Calcula distancia entre 2 puntos geográficos
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ENCUENTRA LA SEDE MÁS CERCANA
function encontrarSedesCercana(latProyecto, lngProyecto) {
    let sedeMasCercana = null;
    let distanciaMinima = Infinity;

    for (const [key, sede] of Object.entries(sedesFijas)) {
        const distancia = calcularDistancia(latProyecto, lngProyecto, sede.lat, sede.lng);
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            sedeMasCercana = { key, ...sede, distancia: distancia.toFixed(2) };
        }
    }

    return sedeMasCercana;
}

// CONVIERTE DIRECCIÓN A COORDENADAS (Geocoding SIMPLE - usa aproximación)
function geocodificar(direccion) {
    // Esto es una aproximación simple. En producción, usarías una API real.
    // Por ahora, devolvemos coordenadas ficticias o promediadas
    
    // Si contiene palabras clave de sedes, retorna esas coordenadas
    const direccionLower = direccion.toLowerCase();
    
    if (direccionLower.includes("antiguo cuscatlán") || direccionLower.includes("antiguo cuscatlan")) {
        return { lat: 13.6859, lng: -89.2542 };
    } else if (direccionLower.includes("san miguel")) {
        return { lat: 13.4834, lng: -88.1733 };
    } else if (direccionLower.includes("santa ana")) {
        return { lat: 13.9929, lng: -89.5631 };
    } else if (direccionLower.includes("chalatenango")) {
        return { lat: 14.0333, lng: -89.0667 };
    }
    
    // Si no detecta, devuelve aproximación a Antiguo Cuscatlán
    return { lat: 13.6859, lng: -89.2542 };
}