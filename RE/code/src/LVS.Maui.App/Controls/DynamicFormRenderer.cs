using LVS.Core.Models;

namespace LVS.Maui.App.Controls;

/// <summary>
/// Renders dynamic form fields from a list of FormItemDefinition objects.
/// This is the critical component — forms are defined by JSON schemas, not hardcoded.
/// Maps to the React inputGenerator component.
/// </summary>
public class DynamicFormRenderer : ContentView
{
    public static readonly BindableProperty FormDefinitionProperty =
        BindableProperty.Create(
            nameof(FormDefinition),
            typeof(IList<FormItemDefinition>),
            typeof(DynamicFormRenderer),
            propertyChanged: OnFormDefinitionChanged);

    public static readonly BindableProperty FormDataProperty =
        BindableProperty.Create(
            nameof(FormData),
            typeof(Dictionary<string, object?>),
            typeof(DynamicFormRenderer));

    public IList<FormItemDefinition>? FormDefinition
    {
        get => (IList<FormItemDefinition>?)GetValue(FormDefinitionProperty);
        set => SetValue(FormDefinitionProperty, value);
    }

    public Dictionary<string, object?>? FormData
    {
        get => (Dictionary<string, object?>?)GetValue(FormDataProperty);
        set => SetValue(FormDataProperty, value);
    }

    private static void OnFormDefinitionChanged(BindableObject bindable, object oldValue, object newValue)
    {
        if (bindable is DynamicFormRenderer renderer)
            renderer.RenderForm();
    }

    private void RenderForm()
    {
        if (FormDefinition is null || FormDefinition.Count == 0)
        {
            Content = new Label { Text = "No form fields defined.", TextColor = Colors.Gray };
            return;
        }

        var layout = new VerticalStackLayout { Spacing = 12 };

        foreach (var field in FormDefinition)
        {
            var control = CreateControl(field);
            var wrapper = CreateFieldWrapper(field, control);
            layout.Children.Add(wrapper);
        }

        Content = layout;
    }

    private View CreateControl(FormItemDefinition field)
    {
        return field.Type switch
        {
            FormInputType.Input => CreateTextInput(field),
            FormInputType.SearchInput => CreateSearchInput(field),
            FormInputType.NumericInput => CreateNumericInput(field),
            FormInputType.Email => CreateEmailInput(field),
            FormInputType.RadioInput => CreateRadioGroup(field),
            FormInputType.ListboxMultiselect => CreateMultiSelect(field),
            FormInputType.Select => CreatePicker(field),
            FormInputType.DependentSelect => CreateDependentPicker(field),
            FormInputType.Checkbox => CreateCheckbox(field),
            FormInputType.MixedCheckbox => CreateCheckbox(field),
            FormInputType.Textarea => CreateTextArea(field),
            FormInputType.DateInput => CreateDatePicker(field),
            FormInputType.TimeInput => CreateTimePicker(field),
            FormInputType.FileUpload => CreateFilePicker(field),
            FormInputType.Button => CreateButton(field),
            _ => CreateTextInput(field)
        };
    }

    private View CreateFieldWrapper(FormItemDefinition field, View control)
    {
        var wrapper = new VerticalStackLayout { Spacing = 4 };

        if (!string.IsNullOrEmpty(field.Label))
        {
            var label = new Label
            {
                Text = field.Label,
                FontAttributes = FontAttributes.Bold,
                FontSize = 14
            };
            wrapper.Children.Add(label);
        }

        if (field.Description is not null && !string.IsNullOrEmpty(field.Description.Content))
        {
            wrapper.Children.Add(new Label
            {
                Text = field.Description.Content,
                FontSize = 12,
                TextColor = Colors.Gray
            });
        }

        wrapper.Children.Add(control);
        return wrapper;
    }

    private Entry CreateTextInput(FormItemDefinition field)
    {
        var entry = new Entry
        {
            Placeholder = field.Placeholder ?? field.Label,
            Text = GetFieldValue(field.Name)?.ToString() ?? field.DefaultValue ?? string.Empty
        };
        entry.TextChanged += (s, e) => SetFieldValue(field.Name, e.NewTextValue);
        return entry;
    }

    private SearchBar CreateSearchInput(FormItemDefinition field)
    {
        var bar = new SearchBar
        {
            Placeholder = field.Placeholder ?? field.Label,
            Text = GetFieldValue(field.Name)?.ToString() ?? string.Empty
        };
        bar.TextChanged += (s, e) => SetFieldValue(field.Name, e.NewTextValue);
        return bar;
    }

    private Entry CreateNumericInput(FormItemDefinition field)
    {
        var entry = new Entry
        {
            Placeholder = field.Placeholder ?? field.Label,
            Keyboard = Keyboard.Numeric,
            Text = GetFieldValue(field.Name)?.ToString() ?? field.DefaultValue ?? string.Empty
        };
        entry.TextChanged += (s, e) => SetFieldValue(field.Name, e.NewTextValue);
        return entry;
    }

    private Entry CreateEmailInput(FormItemDefinition field)
    {
        var entry = new Entry
        {
            Placeholder = field.Placeholder ?? "email@example.com",
            Keyboard = Keyboard.Email,
            Text = GetFieldValue(field.Name)?.ToString() ?? string.Empty
        };
        entry.TextChanged += (s, e) => SetFieldValue(field.Name, e.NewTextValue);
        return entry;
    }

    private VerticalStackLayout CreateRadioGroup(FormItemDefinition field)
    {
        var group = new VerticalStackLayout { Spacing = 4 };
        var currentValue = GetFieldValue(field.Name)?.ToString();

        if (field.Options is not null)
        {
            foreach (var option in field.Options)
            {
                var radio = new RadioButton
                {
                    Content = option.Label,
                    Value = option.Value,
                    IsChecked = option.Value == currentValue,
                    GroupName = field.Name
                };
                radio.CheckedChanged += (s, e) =>
                {
                    if (e.Value && s is RadioButton rb)
                        SetFieldValue(field.Name, rb.Value);
                };
                group.Children.Add(radio);
            }
        }

        return group;
    }

    private VerticalStackLayout CreateMultiSelect(FormItemDefinition field)
    {
        var layout = new VerticalStackLayout { Spacing = 4 };

        if (field.Options is not null)
        {
            foreach (var option in field.Options)
            {
                var row = new HorizontalStackLayout { Spacing = 8 };
                var checkbox = new CheckBox();
                checkbox.CheckedChanged += (s, e) =>
                {
                    var current = GetFieldValue(field.Name) as List<string> ?? [];
                    if (e.Value)
                    {
                        if (!current.Contains(option.Value))
                            current.Add(option.Value);
                    }
                    else
                    {
                        current.Remove(option.Value);
                    }
                    SetFieldValue(field.Name, current);
                };

                row.Children.Add(checkbox);
                row.Children.Add(new Label { Text = option.Label, VerticalOptions = LayoutOptions.Center });
                layout.Children.Add(row);
            }
        }

        return layout;
    }

    private Picker CreatePicker(FormItemDefinition field)
    {
        var picker = new Picker
        {
            Title = field.Placeholder ?? field.Label
        };

        if (field.Options is not null)
        {
            foreach (var option in field.Options)
                picker.Items.Add(option.Label);

            var currentValue = GetFieldValue(field.Name)?.ToString();
            if (currentValue is not null)
            {
                var idx = field.Options.FindIndex(o => o.Value == currentValue);
                if (idx >= 0) picker.SelectedIndex = idx;
            }
        }

        picker.SelectedIndexChanged += (s, e) =>
        {
            if (picker.SelectedIndex >= 0 && field.Options is not null)
                SetFieldValue(field.Name, field.Options[picker.SelectedIndex].Value);
        };

        return picker;
    }

    private VerticalStackLayout CreateDependentPicker(FormItemDefinition field)
    {
        var layout = new VerticalStackLayout { Spacing = 4 };

        var primaryPicker = new Picker { Title = field.Label ?? "Select" };
        var secondaryPicker = new Picker { Title = "Select..." };

        if (field.Options is not null)
        {
            foreach (var option in field.Options)
                primaryPicker.Items.Add(option.Label);
        }

        primaryPicker.SelectedIndexChanged += (s, e) =>
        {
            secondaryPicker.Items.Clear();
            if (primaryPicker.SelectedIndex >= 0 && field.Options is not null)
            {
                var selectedValue = field.Options[primaryPicker.SelectedIndex].Value;
                if (field.DependentOptions?.TryGetValue(selectedValue, out var depOptions) == true)
                {
                    foreach (var opt in depOptions)
                        secondaryPicker.Items.Add(opt.Label);
                }
            }
        };

        secondaryPicker.SelectedIndexChanged += (s, e) =>
        {
            if (secondaryPicker.SelectedIndex >= 0 && primaryPicker.SelectedIndex >= 0 && field.Options is not null)
            {
                var parentValue = field.Options[primaryPicker.SelectedIndex].Value;
                if (field.DependentOptions?.TryGetValue(parentValue, out var depOptions) == true)
                    SetFieldValue(field.Name, depOptions[secondaryPicker.SelectedIndex].Value);
            }
        };

        layout.Children.Add(primaryPicker);
        layout.Children.Add(secondaryPicker);
        return layout;
    }

    private HorizontalStackLayout CreateCheckbox(FormItemDefinition field)
    {
        var row = new HorizontalStackLayout { Spacing = 8 };
        var isChecked = field.InitialChecked == "true" ||
                        GetFieldValue(field.Name) is true or "true";
        var checkbox = new CheckBox { IsChecked = isChecked };
        checkbox.CheckedChanged += (s, e) => SetFieldValue(field.Name, e.Value);
        row.Children.Add(checkbox);
        row.Children.Add(new Label { Text = field.Label, VerticalOptions = LayoutOptions.Center });
        return row;
    }

    private Editor CreateTextArea(FormItemDefinition field)
    {
        var editor = new Editor
        {
            Placeholder = field.Placeholder ?? field.Label,
            Text = GetFieldValue(field.Name)?.ToString() ?? string.Empty,
            HeightRequest = 100,
            AutoSize = EditorAutoSizeOption.TextChanges
        };
        editor.TextChanged += (s, e) => SetFieldValue(field.Name, e.NewTextValue);
        return editor;
    }

    private DatePicker CreateDatePicker(FormItemDefinition field)
    {
        var picker = new DatePicker();
        var exists = GetFieldValue(field.Name);
        if (exists is DateTime dt)
            picker.Date = dt;

        picker.DateSelected += (s, e) => SetFieldValue(field.Name, e.NewDate);
        return picker;
    }

    private TimePicker CreateTimePicker(FormItemDefinition field)
    {
        var picker = new TimePicker();
        picker.PropertyChanged += (s, e) =>
        {
            if (e.PropertyName == nameof(TimePicker.Time))
                SetFieldValue(field.Name, picker.Time);
        };
        return picker;
    }

    private Button CreateFilePicker(FormItemDefinition field)
    {
        var button = new Button { Text = "Choose File..." };
        button.Clicked += async (s, e) =>
        {
            var result = await FilePicker.Default.PickAsync();
            if (result is not null)
                SetFieldValue(field.Name, result.FullPath);
        };
        return button;
    }

    private Button CreateButton(FormItemDefinition field)
    {
        return new Button { Text = field.Label ?? "Action" };
    }

    private object? GetFieldValue(string fieldName)
    {
        if (FormData is not null && FormData.TryGetValue(fieldName, out var value))
            return value;
        return null;
    }

    private void SetFieldValue(string fieldName, object? value)
    {
        if (FormData is not null)
            FormData[fieldName] = value;
    }
}
