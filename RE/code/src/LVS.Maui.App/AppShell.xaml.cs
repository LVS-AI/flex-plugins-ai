namespace LVS.Maui.App;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        // Register detail routes for navigation
        Routing.RegisterRoute("CaseHome", typeof(Views.CaseHomePage));
        Routing.RegisterRoute("ContactDetails", typeof(Views.ContactFormPage));
    }
}
