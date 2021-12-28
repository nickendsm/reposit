#include <iostream>
#include <cmath>
#include <fstream>
#include <string>
#include <vector>
using namespace std;
// вектор
struct Vect{
    double x;
    double y;
};
// теперь считаем с текстового файла вектора
int main() {
    string line;
    Vect a{};
    Vect b{};
    vector<Vect> left;
    vector<Vect> right;
    ifstream myfile;
    myfile.open ("in.txt");
    if (myfile.is_open()) {
        int nm = 0;
        while (getline(myfile, line)) {
            nm++;
            if (nm == 1) {
                a = {stod(line.substr(0, line.find(' '))), stod(line.substr(line.find(' ') + 1))};
            }
            // идем по следующим векторам
            if (nm > 1) {
                b = {stod(line.substr(0, line.find(' '))), stod(line.substr(line.find(' ') + 1))};
                // посчитали расстояние
                if (a.y * b.x < a.x * b.y) {
                    left.push_back(b);
                }
                if (a.y * b.x > a.x * b.y) {
                    right.push_back(b);
                }
                if (a.y * b.x == a.x * b.y) {
                    right.push_back(b);
                }
            }

        }
        // теперь найдем макс слева и справа от прямой
        float *leftC = new float[left.size()];
        float *rightC = new float[right.size()];
        float constanta = sqrt(a.y * a.y + a.x * a.x);
        if (left.size() >= 1) {
            for (int i = 0; i <= left.size() - 1; i++) {
                b = left[i];
                leftC[i] = fabs(a.y * b.x - a.x * b.y) / constanta;
            }
        }
        if (right.size() >=1) {
            for (int i = 0; i <= right.size() - 1; i++) {
                b = right[i];
                rightC[i] = fabs(a.y * b.x - a.x * b.y) / constanta;
            }
        }
        int lind = 0;
        int rind = 0;
        if (sizeof(leftC) != 0){
            float max = leftC[0];
            for (int i = 1; i<=left.size()-1; i++) {
                if (leftC[i] >= max) {
                    max = leftC[i];
                    lind = i;
                }
            }
            Vect Leftmost = left[lind];
            cout << "Leftmost: " << Leftmost.x << " ";
            cout << Leftmost.y << endl;
        } else { cout << "Leftmost: 0 0" << endl;}
        if (sizeof(rightC) != 0) {
            int max = rightC[0];
            for (int i = 1; i <= right.size() - 1; i++) {
                if (rightC[i] >= max) {
                    max = rightC[i];
                    rind = i;
                }
            }
            Vect Rightmost = right[rind];
            cout << "Rightmost: " << Rightmost.x << " ";
            cout << Rightmost.y << endl;
        } else { cout << "Rightmost: 0 0" <<endl;}
    }
    myfile.close();     // закрываем файл
    return 0;
}
