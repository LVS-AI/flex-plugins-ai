namespace LVS.Maui.App.Controls;

/// <summary>
/// A badge control for displaying case/contact status with colored background.
/// Maps to the StatusBadge React component.
/// </summary>
public class StatusBadge : Border
{
    public static readonly BindableProperty StatusTextProperty =
        BindableProperty.Create(nameof(StatusText), typeof(string), typeof(StatusBadge),
            propertyChanged: OnStatusChanged);

    public static readonly BindableProperty StatusColorProperty =
        BindableProperty.Create(nameof(StatusColor), typeof(Color), typeof(StatusBadge),
            defaultValue: Colors.Gray,
            propertyChanged: OnStatusChanged);

    public string? StatusText
    {
        get => (string?)GetValue(StatusTextProperty);
        set => SetValue(StatusTextProperty, value);
    }

    public Color StatusColor
    {
        get => (Color)GetValue(StatusColorProperty);
        set => SetValue(StatusColorProperty, value);
    }

    private readonly Label _label;

    public StatusBadge()
    {
        StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle { CornerRadius = 4 };
        Padding = new Thickness(8, 4);
        _label = new Label
        {
            FontSize = 12,
            TextColor = Colors.White,
            HorizontalOptions = LayoutOptions.Center,
            VerticalOptions = LayoutOptions.Center
        };
        Content = _label;
        UpdateAppearance();
    }

    private static void OnStatusChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is StatusBadge badge)
            badge.UpdateAppearance();
    }

    private void UpdateAppearance()
    {
        _label.Text = StatusText ?? "Unknown";
        BackgroundColor = StatusColor;
    }
}
