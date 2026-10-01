<x-errors.page
    :code="429"
    :title="__('Too many requests')"
    :heading="__('Too much traffic')"
    :message="__('You sent too many requests in a short time. Pause a moment, then try again.')"
    :action-label="__('Go home')"
    :action-url="url('/')"
/>
