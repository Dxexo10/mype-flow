# UIT 2026 (referencial, ajustar si tienes el valor oficial exacto del año fiscal correspondiente)
UIT_2026 = 5350.0

def recomendar_regimen(capital_social: float, numero_socios: int, tiene_dni_electronico: bool, conoce_regimen_sacs: bool):
    barreras = []
    limite_sacs = 4 * UIT_2026

    if capital_social <= limite_sacs and numero_socios <= 20:
        regimen = "SACS"
        justificacion = (
            f"Con un capital de S/{capital_social:,.2f} (menor a 4 UIT = S/{limite_sacs:,.2f}) "
            f"y {numero_socios} socio(s), calificas para constituirte como Sociedad por Acciones "
            f"Cerrada Simplificada (SACS), con costo de solo S/18.70 y sin necesidad de notario."
        )

        # Barreras reales identificadas en el artículo
        if not tiene_dni_electronico:
            barreras.append(
                "No cuentas con DNI electrónico: la SACS exige firma digital para constituirse "
                "100% en línea, lo cual puede ser una barrera técnica."
            )
        if not conoce_regimen_sacs:
            barreras.append(
                "Bajo conocimiento del régimen SACS: incluso algunas agencias bancarias no lo "
                "reconocen bien, lo que puede dificultar la apertura de tu cuenta empresarial."
            )
    else:
        regimen = "SAC"
        justificacion = (
            f"Con un capital de S/{capital_social:,.2f} o {numero_socios} socios, no calificas "
            f"para el régimen simplificado SACS. Se recomienda una Sociedad Anónima Cerrada (SAC) "
            f"tradicional, que sí requiere notaría."
        )

    return {
        "regimen_recomendado": regimen,
        "justificacion": justificacion,
        "barreras_detectadas": barreras
    }