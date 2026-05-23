
import java.util.*;
import javax.swing.*;

public class SumaRomanos {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Suma Números Romanos");
        JTextField campo1 = new JTextField(10);
        JTextField campo2 = new JTextField(10);
        JButton boton = new JButton("Sumar");
        JLabel resultado = new JLabel("Resultado:");

        frame.setLayout(new java.awt.FlowLayout());
        frame.add(new JLabel("1erN°:"));
        frame.add(campo1);
        frame.add(new JLabel("2doN°:"));
        frame.add(campo2);
        frame.add(boton);
        frame.add(resultado);

        boton.addActionListener((ActionEvent ) -> {
            String romano1 = campo1.getText().toUpperCase();
            String romano2 = campo2.getText().toUpperCase();
            
            try {
                int num1 = romanoAEntero(romano1);
                int num2 = romanoAEntero(romano2);
                int suma = num1 + num2;
                String resultadoRomano = enteroARomano(suma);
                resultado.setText("Resultado: " + resultadoRomano);
            } catch (Exception ex) {
                resultado.setText("Error: número inválido");
            }
        });

        frame.setSize(400, 200);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }

    static int romanoAEntero(String s) {
        Map<Character, Integer> mapa = new HashMap<>();
        mapa.put('I', 1);
        mapa.put('V', 5);
        mapa.put('X', 10);
        mapa.put('L', 50);
        mapa.put('C', 100);
        mapa.put('D', 500);
        mapa.put('M', 1000);

        int total = 0;
        int prev = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            int curr = mapa.getOrDefault(s.charAt(i), -1);
            if (curr == -1) throw new IllegalArgumentException("Número romano inválido");
            if (curr < prev) {
                total -= curr;
            } else {
                total += curr;
            }
            prev = curr;
        }
        return total;
    }

    static String enteroARomano(int num) {
        String[] simbolos = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
        int[] valores = {1000,900,500,400,100,90,50,40,10,9,5,4,1};

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < valores.length; i++) {
            while (num >= valores[i]) {
                num -= valores[i];
                sb.append(simbolos[i]);
            }
        }
        return sb.toString();
    }
}
