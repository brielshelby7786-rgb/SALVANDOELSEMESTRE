// .- Escribir un programa para implementar una aplicación con interfaz que emule ser un block de notas, que contenga un contador de palabras y un indetificador de fila en la que se esta escribiendo.

public class BlocDeNotas {

    public static void main(String[] args) {
        String texto = "Contador de palabrtas.";

        int contadorPalabras = contarPalabras(texto);
        int numeroLineas = contarLineas(texto);

        System.out.println("Número de palabras: " + contadorPalabras);
        System.out.println("Número de líneas: " + numeroLineas);


        //Simulación de indicador de línea.
        System.out.println("Línea actual (simulando): 1");
    }

    public static int contarPalabras(String texto) {
        if (texto == null || texto.isEmpty()) {
            return 0;
        }
        return texto.trim().split("\\s+").length;
    }

    public static int contarLineas(String texto){
        if(texto == null || texto.isEmpty()){
            return 0;
        }
        return texto.split("\n").length;
    }
}
