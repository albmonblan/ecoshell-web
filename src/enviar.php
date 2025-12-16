<?php
// Configuración para mostrar errores si algo falla gravemente
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Recogemos y limpiamos los datos del formulario
    $nombre = strip_tags(trim($_POST["nombre"]));
    $apellidos = strip_tags(trim($_POST["apellidos"]));
    $email_usuario = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $telefono = trim($_POST["telefono"]);
    $perfil = trim($_POST["perfil"]); // Empresa, Estudiante, Otro
    $mensaje = trim($_POST["mensaje"]);

    // 2. Configuración del correo
    $destinatario = "albertomonteroblanch@gmail.com"; // TU CORREO REAL
    $asunto = "Contacto Web: $nombre ($perfil)";

    // 3. Cuerpo del mensaje
    $cuerpo = "Has recibido un nuevo mensaje desde la web UPV Eco-Marathon.\n\n";
    $cuerpo .= "--------------------------------------------------\n";
    $cuerpo .= "Nombre: $nombre $apellidos\n";
    $cuerpo .= "Email: $email_usuario\n";
    $cuerpo .= "Teléfono: $telefono\n";
    $cuerpo .= "Perfil: $perfil\n";
    $cuerpo .= "--------------------------------------------------\n\n";
    $cuerpo .= "Mensaje:\n$mensaje\n";

    // 4. Cabeceras (Headers) - CLAVE PARA QUE NO SEA SPAM
    // El 'From' DEBE ser una dirección del dominio del servidor para que no lo bloqueen.
    // Usamos 'no-reply@...' y ponemos al usuario en 'Reply-To'.
    $headers = "From: Web UPV Eco-Marathon <no-reply@upvecomarathon.webs.upv.es>\r\n";
    $headers .= "Reply-To: $email_usuario\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 5. Enviar
    if (mail($destinatario, $asunto, $cuerpo, $headers)) {
        // Éxito: Redirigir de vuelta con mensaje de éxito
        header("Location: contactanos.html?status=success");
        exit;
    } else {
        // Error del servidor
        header("Location: contactanos.html?status=error_server");
        exit;
    }

} else {
    // Si intentan entrar directamente a enviar.php sin formulario
    header("Location: contactanos.html");
    exit;
}
?>