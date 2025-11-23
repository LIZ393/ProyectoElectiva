using SagradoAbadAPP.Vistas;

namespace SagradoAbadAPP
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            MainPage = new NavigationPage(new Tabs());
            Application.Current.UserAppTheme = AppTheme.Light;

        }
    }
}
