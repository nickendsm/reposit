import sys
import matplotlib
import random
matplotlib.use('Qt5Agg')
import numpy as np
from PyQt5 import QtCore, QtGui, QtWidgets

from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg, NavigationToolbar2QT as NavigationToolbar
from matplotlib.figure import Figure


class MplCanvas(FigureCanvasQTAgg):

    def __init__(self, parent=None, width=5, height=4, dpi=100):
        fig = Figure(figsize=(width, height), dpi=dpi)
        self.axes = fig.add_subplot(111)
        super(MplCanvas, self).__init__(fig)


class MainWindow(QtWidgets.QMainWindow):
    
    def update_plot(self):
            self.ydata = [i + 1 for i in self.ydata]
            self.sc.axes.cla()  # Clear the canvas.
            self.sc.axes.plot(self.xdata, self.ydata, 'r')
            # Trigger the canvas to update and redraw.
            self.sc.draw()
            
    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)
        
        self.sc = MplCanvas(self, width=5, height=4, dpi=100)
#         sc.axes.plot([0,1,2,3,4], [10,1,20,3,40])
        self.sc2 = MplCanvas(self, width=5, height=4, dpi=100)
        self.sc2.axes.plot([0,1,2,3,4], [10,1,20,3,40])
        
        # Create toolbar, passing canvas as first parament, parent (self, the MainWindow) as second.
        toolbar = NavigationToolbar(self.sc, self)

        layout = QtWidgets.QVBoxLayout()
        layout.addWidget(toolbar)
        layout.addWidget(self.sc)
        layout.addWidget(self.sc2)
        widget = QtWidgets.QWidget()
        widget.setLayout(layout)
        self.setCentralWidget(widget)
        
        self.xdata = np.arange(50)
        self.ydata = [random.randint(0, 10) for i in self.xdata]
        self.update_plot()

        self.show()

        # Setup a timer to trigger the redraw by calling update_plot.
        self.timer = QtCore.QTimer()
        self.timer.setInterval(100)
        self.timer.timeout.connect(self.update_plot)
        self.timer.start()
        # Create a placeholder widget to hold our toolbar and canvas.

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    w = MainWindow()
    app.exec_()