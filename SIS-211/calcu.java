import java.util.Scanner;

public class calcu {

    @SuppressWarnings({"ConvertToStringSwitch", "ConvertToTryWithResources"})
    public static void main(String[] args) {
        try (// Creamos un objeto Scanner para leer la entrada del usuario.
        Scanner entrada = new Scanner(System.in)) {
            System.out.println("¡Bienvenidos a mi calculadora!");

            // Bucle principal para realizar varias operaciones.
            while (true) {
                double num1, num2;
                String operador;

                // Pedimos el primer número.
                System.out.print("Por favor, introduce el primer número: ");
                // Manejo de errores simples.
                while (!entrada.hasNextDouble()) {
                    System.out.println("¡Eso no es un número! Inténtalo de nuevo:");
                    entrada.next(); 
                }
                num1 = entrada.nextDouble();


                // Pedimos el operador.
                System.out.print("Introduce el operador (+, -, *, /): ");
                operador = entrada.next();


                // Pedimos el segundo número.
                System.out.print("Por favor, introduce el segundo número: ");
                while (!entrada.hasNextDouble()) {
                    System.out.println("¡Eso no es un número! Inténtalo de nuevo:");
                    entrada.next();
                }
                num2 = entrada.nextDouble();

                double resultado;

                // Realizamos la operación.
                if (operador.equals("+")) {
                    resultado = num1 + num2;
                } else if (operador.equals("-")) {
                    resultado = num1 - num2;
                } else if (operador.equals("*")) {
                    resultado = num1 * num2;
                } else if (operador.equals("/")) {
                    if (num2 == 0) {
                        System.out.println("¡No se puede dividir entre cero!");
                        continue; // Volvemos al inicio del bucle.
                    }
                    resultado = num1 / num2;
                } else {
                    System.out.println("Operador inválido.");
                    continue; // Volvemos al inicio del bucle.
                }

                // Mostramos el resultado.
                System.out.println("El resultado es: " + resultado);

                // Preguntamos si el usuario quiere hacer otra operación.
                System.out.print("¿Quieres realizar otra operación? (si/no): ");
                String respuesta = entrada.next();
                if (!respuesta.equalsIgnoreCase("si")) {
                    break; // Salimos del bucle si el usuario no quiere continuar.
                }
            }
        }
    }
}
