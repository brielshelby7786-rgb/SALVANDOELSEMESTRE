
import java.awt.event.*;
import java.io.*;
import javax.swing.*;

public class EditorTexto {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Editor de Texto");
        JTextArea area = new JTextArea(20, 30);
        JButton abrir = new JButton("Abrir");
        JButton guardar = new JButton("Guardar");
        JLabel contador = new JLabel("Existen 0 palabra(s)");

        frame.setLayout(new java.awt.FlowLayout());
        frame.add(new JScrollPane(area));
        frame.add(abrir);
        frame.add(guardar);
        frame.add(contador);

        abrir.addActionListener(e -> {
            JFileChooser chooser = new JFileChooser();
            int option = chooser.showOpenDialog(frame);
            if (option == JFileChooser.APPROVE_OPTION) {
                File file = chooser.getSelectedFile();
                try (BufferedReader br = new BufferedReader(new FileReader(file))) {
                    area.read(br, null);
                    actualizarContador(area, contador);
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        });

        guardar.addActionListener(e -> {
            JFileChooser chooser = new JFileChooser();
            int option = chooser.showSaveDialog(frame);
            if (option == JFileChooser.APPROVE_OPTION) {
                File file = chooser.getSelectedFile();
                try (BufferedWriter bw = new BufferedWriter(new FileWriter(file))) {
                    area.write(bw);
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        });

        area.addKeyListener(new KeyAdapter() {
            public void keyReleased(KeyEvent e) {
                actualizarContador(area, contador);
            }
        });

        frame.pack();
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }

    static void actualizarContador(JTextArea area, JLabel contador) {
        String texto = area.getText().trim();
        int palabras = texto.isEmpty() ? 0 : texto.split("\\s+").length;
        contador.setText("Existen " + palabras + " palabra(s)");
    }
}
