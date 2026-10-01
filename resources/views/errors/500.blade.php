<x-errors.page
    :code="500"
    :title="__('Server error')"
    :heading="__('Something came unplugged')"
    :message="__('We hit an unexpected problem. Please try again in a moment.')"
    :action-label="__('Go home')"
    :action-url="url('/')"
/>
