@props(['code'])

<figure {{ $attributes->merge(['class' => 'error-illustration mx-auto w-full max-w-[22rem]']) }} aria-hidden="true">
    @include('errors.illustrations.'.$code)
</figure>
